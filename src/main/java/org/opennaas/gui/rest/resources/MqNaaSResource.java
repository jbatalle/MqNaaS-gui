package org.opennaas.gui.rest.resources;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import org.opennaas.gui.services.RestServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;

@Component
@Path("/mqnaas")
public class MqNaaSResource {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

//    @Produces(MediaType.APPLICATION_XML)
    @GET
    @Path("/{res1:.*}")
    public @ResponseBody
    String get(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        this.logger.info("GET()");
        String url = "http://admin:123456@localhost:9000/mqnaas/IRootResourceProvider";
        logger.info("URI: " + (String) request.getAttribute("uri"));
        HttpServletRequest req = (HttpServletRequest) request;
        request.setAttribute("uri", req.getRequestURI().substring(req.getContextPath().length()));
        request.setAttribute("path", request.getPathInfo());
        // Forward filtered requests to MyProxy servlet
        request.getRequestDispatcher("/ProxyServlet").forward(request, response);

        return "";
        /*        logger.error(request.getContextPath());
         logger.error(request.getPathInfo());
         logger.error(request.getQueryString());
         logger.error(request.getServletPath());
         logger.error(request.getRequestURI());
         logger.error(request.getRequestURL().toString());
         Enumeration hed = request.getHeaderNames();
         while(hed.hasMoreElements()){
         String keyHeader = (String) hed.nextElement();
         logger.error(keyHeader);
         Enumeration headerValues = request.getHeaders(keyHeader);
         while(headerValues.hasMoreElements()){
         String valueHeader = (String) headerValues.nextElement();
         logger.error(valueHeader);
         }
         List headerValuesList=Collections.list(headerValues);
         }

         String response2 = clientJersey.get(path, request);
         */
        //HttpHeaders hH = req.getHeaders();
//        List<org.springframework.http.MediaType> accept = hH.getAccept();
//        org.springframework.http.MediaType contentType = hH.getContentType();
//        logger.error("Cotnenttype: "+contentType.getType());
//        logger.error("Cotnenttype: "+contentType.getSubtype());
        //return response2;
    }
    /*
     @POST
     @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
     @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
     @Path("{path}")
     public String post(@PathParam("path") String path, HttpRequest req) throws JsonGenerationException, JsonMappingException, IOException, RestServiceException {
     this.logger.info("GET() " + path);
     logger.info("GET METHOD...");
     logger.info(path);
     String response = clientJersey.get(path, req);
     return response;
     }*/

    @PUT
//    @Consumes(MediaType.APPLICATION_XML)
//    @Produces(MediaType.TEXT_PLAIN)
    @Path("/{res1:.*}")
    public @ResponseBody
    void put(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        this.logger.info("PUT() ");

        String body = null;
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
        body = stringBuilder.toString();

        logger.info("URI: " + (String) request.getAttribute("uri"));
        logger.info("Object: " + body);
        HttpServletRequest req = (HttpServletRequest) request;
        request.setAttribute("uri", req.getRequestURI().substring(req.getContextPath().length()));
        request.setAttribute("path", request.getPathInfo());
        request.setAttribute("object", body);
        // Forward filtered requests to MyProxy servlet
        request.getRequestDispatcher("/ProxyServlet").forward(request, response);

        return;
    }

    @DELETE
    @Path("/{res1:.*}")
    public void delete(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException, RestServiceException, ServletException {
        this.logger.info("DELETE() ");
        String url = "http://admin:123456@localhost:9000/mqnaas/IRootResourceProvider";
        logger.info("URI: " + (String) request.getAttribute("uri"));

        HttpServletRequest req = (HttpServletRequest) request;
        request.setAttribute("uri", req.getRequestURI().substring(req.getContextPath().length()));
        request.setAttribute("path", request.getPathInfo());
        request.getRequestDispatcher("/ProxyServlet").forward(request, response);
    }
}
