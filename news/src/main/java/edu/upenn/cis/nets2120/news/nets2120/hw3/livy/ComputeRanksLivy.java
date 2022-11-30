package edu.upenn.cis.nets2120.hw3.livy;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.apache.livy.LivyClient;
import org.apache.livy.LivyClientBuilder;

import edu.upenn.cis.nets2120.config.Config;

public class ComputeRanksLivy {
	public static void main(String[] args) throws IOException, URISyntaxException, InterruptedException, ExecutionException {
		
		LivyClient client = new LivyClientBuilder()
				  .setURI(new URI("http://ec2-44-200-236-236.compute-1.amazonaws.com:8998/"))
				  .build();

		try {
			String jar = "target/nets2120-hw3-0.0.1-SNAPSHOT.jar";
			
		    System.out.printf("Uploading %s to the Spark context...\n", jar);
		    client.uploadJar(new File(jar)).get();
		  
		    String sourceFile = Config.BIGGER_SOCIAL_NET_PATH; //.SOCIAL_NET_PATH; 
		    
		    // Run both jobs
		    System.out.printf("Running SocialRankJob with %s as its input...\n", sourceFile);
		    List<MyPair<Integer,Double>> result = client.submit(new SocialRankJob(true, sourceFile)).get();
		    System.out.println("With backlinks: " + result);
		    
		    List<MyPair<Integer,Double>> result_2 = client.submit(new SocialRankJob(false, sourceFile)).get();
		    System.out.println("Without backlinks: " + result_2);
		    
		    // Get results
		    Set<String> with_backlinks = result.stream().map(p -> p.getLeft().toString()).collect(Collectors.toSet());
		    Set<String> without_backlinks = result_2.stream().map(p -> p.getLeft().toString()).collect(Collectors.toSet());
		    
		    // Intersection
		    Set<String> common = new HashSet<String>(with_backlinks);		
		    common.retainAll(without_backlinks);
		    
		    // with - without
		    Set<String> with_exclusive = new HashSet<String>(with_backlinks);	
		    with_exclusive.removeAll(without_backlinks);
		    
		    // without - with
		    Set<String> without_exclusive = new HashSet<String>(without_backlinks);	
		    without_exclusive.removeAll(with_backlinks);
		    
		    // write results
		    FileWriter writer = new FileWriter("results2.txt");
	    	try {
				writer.write("Nodes in both lists:" + "\n");
				writer.write(String.join(", ", common));
				writer.write("\n");
				writer.write("Nodes only in with-backlinks:" + "\n");
				writer.write(String.join(", ", with_exclusive));
				writer.write("\n");
				writer.write("Nodes only in without-backlinks:" + "\n");
				writer.write(String.join(", ", without_exclusive));
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		    writer.close();
		} finally {
		    client.stop(true);
		}
	}

}
