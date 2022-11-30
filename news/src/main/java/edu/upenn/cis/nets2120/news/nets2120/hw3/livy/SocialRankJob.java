package edu.upenn.cis.nets2120.hw3.livy;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.apache.livy.Job;
import org.apache.livy.JobContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;

import edu.upenn.cis.nets2120.config.Config;
import edu.upenn.cis.nets2120.storage.SparkConnector;
import scala.Tuple2;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

public class SocialRankJob implements Job<List<MyPair<Integer,Double>>> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Connection to Apache Spark
	 */
	SparkSession spark;
	
	JavaSparkContext context;

	private boolean useBacklinks;

	private String source;
	
	private final double D_MAX = 30;
	private final int I_MAX = 25;
	

	/**
	 * Initialize the database connection and open the file
	 * 
	 * @throws IOException
	 * @throws InterruptedException 
	 * @throws DynamoDbException 
	 */
	public void initialize() throws IOException, InterruptedException {
		System.out.println("Connecting to Spark...");
		spark = SparkConnector.getSparkConnection();
		context = SparkConnector.getSparkContext();
		
		System.out.println("Connected!");
	}
	
	/**
	 * Fetch the social network from the S3 path, and create a (followed, follower) edge graph
	 * 
	 * @param filePath
	 * @return JavaPairRDD: (followed: int, follower: int)
	 */
	JavaPairRDD<Integer,Integer> getSocialNetwork(String filePath) {
		// Read into RDD with lines as strings
		JavaRDD<String[]> file = context.textFile(filePath, Config.PARTITIONS)
				.map(line -> line.toString().split("[ \t]"));
		
		// Create a network PairRDD from the RDD of lines
		JavaPairRDD<Integer, Integer> network = file.mapToPair(line -> new Tuple2<Integer, Integer>(
				Integer.parseInt(line[0]), 
				Integer.parseInt(line[1])));
		
		// Remove duplicate connections		
		network = network.distinct();
		
		return network;
	}
	
	private JavaRDD<Integer> getSinks(JavaPairRDD<Integer,Integer> network) {
		// Get the number of unique nodes and edges
		JavaRDD<Integer> outgoing = network.map(x -> x._1);
		JavaRDD<Integer> ingoing = network.map(x -> x._2);
		
		int numNodes = (int) outgoing.union(ingoing).distinct().count();
		int numEdges = (int) network.count();
		
		System.out.println(String.format("This graph contains %d nodes and %d edges", numNodes, numEdges));
		
		// Sinks are nodes with ingoing edges that have no outgoing edges
		JavaRDD<Integer> sinks = ingoing.subtract(outgoing).distinct();
		
		return sinks;
	}
	
	/**
	 * Helper method to get a PairRDD containing the initial ranks for each node
	 * 
	 * @param network
	 * @return socialRanks
	 */
	private JavaPairRDD<Integer, Double> getInitSocialRanks(JavaPairRDD<Integer,Integer> network) {
		// Get the number of unique nodes and edges
		JavaRDD<Integer> outgoing = network.map(x -> x._1);
		JavaRDD<Integer> ingoing = network.map(x -> x._2);
		
		return outgoing.union(ingoing).distinct().mapToPair(node -> new Tuple2<Integer, Double>(node, 1.0));
	}

	/**
	 * Main functionality in the program: read and process the social network
	 * 
	 * @throws IOException File read, network, and other errors
	 * @throws DynamoDbException DynamoDB is unhappy with something
	 * @throws InterruptedException User presses Ctrl-C
	 */
	public List<MyPair<Integer,Double>> run() throws IOException, InterruptedException {
		System.out.println("Running");

		// Load the social network
		// followed, follower
		JavaPairRDD<Integer, Integer> network = getSocialNetwork(source);

		// Take the TO nodes
		JavaRDD<Integer> sinks = getSinks(network);

		// Get an RDD of all the sinks mapped to their incoming edges
		// We do this by flipping the network PairRDD, joining with all sinks
		// mapping back to a proper tuple
		JavaPairRDD<Integer, Integer> backlinks = network.mapToPair(p -> p.swap())
			.join(sinks.mapToPair(n -> new Tuple2<Integer, Boolean>(n, true)))
			.mapToPair(p -> new Tuple2<Integer, Integer>(p._1, p._2._1));
		
		if (useBacklinks) {
			network = network.union(backlinks);
			System.out.println(String.format("Added %d backlinks", backlinks.count()));
		}
		
		// How much each node sends
		JavaPairRDD<Integer, Double> nodeTransferRDD = network
				.mapToPair(p -> new Tuple2<Integer, Double>(p._1, 1.0))
				.reduceByKey((a, b) -> a + b)
				.mapToPair(p -> new Tuple2<Integer, Double>(p._1, 1.0 / p._2));
		
		// Join the RDDs (node, (outgoing, weight))
		JavaPairRDD<Integer, Tuple2<Integer, Double>> edgeTransferRDD = network.join(nodeTransferRDD);
		
		// Initialize social ranks (node ID, rank)
		JavaPairRDD<Integer, Double> socialRankRDD = getInitSocialRanks(network);
		
		int maxIters = I_MAX;
		
		System.out.println("Beginning training");
		
		for (int i = 0; i < maxIters; i++) {
			
			System.out.println("Iteration: " + String.valueOf(i));
			
			// (outgoing, weight * rank)
			JavaPairRDD<Integer, Double> newSocialRankRDD = edgeTransferRDD.join(socialRankRDD)
			.mapToPair(p -> new Tuple2<Integer, Double>(
					p._2._1._1, p._2._1._2 * p._2._2))
			.reduceByKey((a, b) -> a + b)
			.mapToPair(p -> new Tuple2<Integer, Double>(p._1, (p._2 * (1 - 0.15)) + 0.15));
			
			// Check if we should stop early
			JavaRDD<Double> diffs = socialRankRDD.join(newSocialRankRDD).map(p -> Math.abs(p._2._1 - p._2._2));
			double maxValue = diffs.reduce((d1, d2) -> Math.max(d1,  d2));
			
			if (maxValue < D_MAX) {
				break;
			}
			
			socialRankRDD = newSocialRankRDD;
		}
		
		System.out.println("*** Finished social network ranking! ***");
		
		// Get the top 10 values and print them
		List<MyPair<Integer, Double>> results = socialRankRDD.mapToPair(p -> p.swap()).sortByKey(false).map(p -> new MyPair<Integer, Double>(p._2, p._1)).take(10);
		
		return results;
	}

	public SocialRankJob(boolean useBacklinks, String source) {
		System.setProperty("file.encoding", "UTF-8");
		
		this.useBacklinks = useBacklinks;
		this.source = source;
	}

	@Override
	public List<MyPair<Integer,Double>> call(JobContext arg0) throws Exception {
		initialize();
		List<MyPair<Integer,Double>> results = run();
		
		// Can't serialize an abstract list
		ArrayList<MyPair<Integer,Double>> finalResults = new ArrayList<MyPair<Integer, Double>>();
		
		System.out.println("Finished running");
		results.forEach(p -> {
			System.out.println(p.getLeft() + ": " + p.getRight());
			finalResults.add(p);
		});
		return finalResults;
	}

}
