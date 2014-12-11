package org.opennaas.gui.proxy;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map.Entry;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class ProxyServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final String USER_AGENT = "Mozilla/5.0";

    public ProxyServlet() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //  Create Get request dynamically to remote server
        String url = "http://ipaddress:port/contextpath" + request.getAttribute("uri") + "?" + request.getQueryString();
        url = "http://admin:123456@localhost:9000/mqnaas/"+request.getAttribute("uri");
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response1 = new StringBuffer();

        ServletOutputStream sout = response.getOutputStream();

        while ((inputLine = in.readLine()) != null) {
            response1.append(inputLine);
            sout.write(inputLine.getBytes());
        }
        in.close();

        sout.flush();

    }
    /*
     protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     //  Create Post request dynamically to remote server
     String url = "http://ipaddress:port/contextpath"+request.getAttribute("uri");
        
     URL obj = new URL(url);
     HttpURLConnection con = (HttpURLConnection) obj.openConnection();
 
     //add reuqest header
     con.setRequestMethod("POST");
     con.setRequestProperty("User-Agent", USER_AGENT);
     con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
 
     StringBuilder sb = new StringBuilder();
     for(Entry<String, String[]> e : request.getParameterMap().entrySet()){
     if(sb.length() > 0){
     sb.append('&');
     }
     String[] temp =e.getValue();
     for(String s:temp) {
     sb.append(URLEncoder.encode(e.getKey(), "UTF-8")).append('=').append(URLEncoder.encode(s, "UTF-8"));  
     }
     }
        
     String urlParameters = sb.toString();
 
        
     // Send post request
     con.setDoOutput(true);
     DataOutputStream wr = new DataOutputStream(con.getOutputStream());
     wr.writeBytes(urlParameters);
     wr.flush();
     wr.close();
 
     int responseCode = con.getResponseCode();
     System.out.println("\nSending 'POST' request to URL : " + url);
     System.out.println("Post parameters : " + urlParameters);
     System.out.println("Response Code : " + responseCode);
 
     BufferedReader in = new BufferedReader(
     new InputStreamReader(con.getInputStream()));
     String inputLine;
     StringBuffer response1 = new StringBuffer();
 
     ServletOutputStream sout = response.getOutputStream();
        
     while ((inputLine = in.readLine()) != null) {
     response1.append(inputLine);
     sout.write(inputLine.getBytes());
     }
     in.close();
 
     sout.flush();
     }
     */
}
