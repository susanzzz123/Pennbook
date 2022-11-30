package edu.upenn.cis.nets2120.news;

import java.io.BufferedReader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.yarn.webapp.hamlet.HamletSpec._;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableWriteItems;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ResourceInUseException;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.codegurureviewer.model.transform.CommitDiffSourceCodeTypeJsonUnmarshaller;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

import scala.Tuple2;

// import edu.upenn.cis.nets2120.config.Config;
// import edu.upenn.cis.nets2120.storage.SparkConnector;

public class ComputeRanks {	
	
	/**
	 * The basic logger
	 */
	static Logger logger = LogManager.getLogger(ComputeRanks.class);

	/**
	 * Connection to DynamoDB
	 */
	DynamoDB db;

	/**
	 * Connection to Apache Spark
	 */
	SparkSession spark;
	
	JavaSparkContext context;

	/**
	 * Params
	 */
	public double D_MAX;
	public int I_MAX;
	public boolean DEBUG;
	
	public static double DECAY = 0.15;
	
	public ComputeRanks() {
		System.setProperty("file.encoding", "UTF-8");
		
		this.D_MAX = 30;
		this.I_MAX = 15;
		this.DEBUG = false;
	}

	/**
	 * Initialize the database connection and open the file
	 * 
	 * @throws IOException
	 * @throws InterruptedException 
	 */
	public void initialize() throws IOException, InterruptedException {
		logger.info("Connecting to Spark...");

		spark = SparkConnector.getSparkConnection();
		context = SparkConnector.getSparkContext();
		
		logger.debug("Connected!");
	}
	
    


	/**
	 * Fetch the social network from the S3 path, and create a (followed, follower) edge graph
	 * 
	 * @param filePath
	 * @return JavaPairRDD: (followed: int, follower: int)
	 * @throws IOException 
	 */
	JavaPairRDD<Integer,Integer> getSocialNetwork(String filePath) throws IOException {
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
		
		logger.info(String.format("This graph contains %d nodes and %d edges", numNodes, numEdges));
		
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
		Jav