package org.opennaas.gui.rest.resources;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.opennaas.gui.JsonViews;
import org.opennaas.gui.dao.history.HistoryEntryDao;
import org.opennaas.gui.entity.HistoryEntry;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.opennaas.gui.services.ARNClient;
import org.opennaas.gui.services.RestServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Path("/arn")
public class ARNResource {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private HistoryEntryDao historyEntryDao;

    @Autowired
    private ObjectMapper mapper;
    
    @Autowired
    private ARNClient arnClient;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    public String list() throws JsonGenerationException, JsonMappingException, IOException {
        this.logger.info("list()");
String content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<request>\n" +
" <operation token=\"0\" type=\"show\" entity=\"equipment\">\n" +
" <equipment id='0' />\n" +
" </operation>\n" +
" </operation>\n" +
"</request>";
String response = "";
        try {
            response = arnClient.post(content);
        } catch (RestServiceException ex) {
            logger.error("SOme errror");
            java.util.logging.Logger.getLogger(ARNResource.class.getName()).log(Level.SEVERE, null, ex);
        }

        return response;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public HistoryEntry read(@PathParam("id") Long id) {
        this.logger.info("read(id)");

        HistoryEntry historyEntry = this.historyEntryDao.find(id);
        if (historyEntry == null) {
            throw new WebApplicationException(404);
        }
        return historyEntry;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public HistoryEntry create(HistoryEntry historyEntry) {
        this.logger.info("create(): " + historyEntry);

        return this.historyEntryDao.save(historyEntry);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public HistoryEntry update(@PathParam("id") Long id, HistoryEntry historyEntry) {
        this.logger.info("update(): " + historyEntry);

        return this.historyEntryDao.save(historyEntry);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public void delete(@PathParam("id") Long id) {
        this.logger.info("delete(id)");

        this.historyEntryDao.delete(id);
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof String && ((String) principal).equals("anonymousUser")) {
            return false;
        }
        UserDetails userDetails = (UserDetails) principal;

        for (GrantedAuthority authority : userDetails.getAuthorities()) {
            if (authority.toString().equals("admin")) {
                return true;
            }
        }

        return false;
    }

}
