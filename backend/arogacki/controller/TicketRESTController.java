package pl.dmcs.arogacki.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.arogacki.model.Concert;
import pl.dmcs.arogacki.model.Ticket;
import pl.dmcs.arogacki.model.User;
import pl.dmcs.arogacki.repository.ConcertRepository;
import pl.dmcs.arogacki.repository.TicketRepository;
import pl.dmcs.arogacki.repository.UserRepository;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/restApi/ticket")
public class TicketRESTController {
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private ConcertRepository concertRepository;
    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    public List<Ticket> listAllTickets(){
        return ticketRepository.findAll();
    }
    @RequestMapping(value="/{id}", method = RequestMethod.GET)
    public Ticket findTicketById(@PathVariable("id") long id){
        return ticketRepository.findById(id);
    }
    @RequestMapping(value="/user/{username}", method = RequestMethod.GET)
    public List<Ticket> findTicketByUsername(@PathVariable("username") String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));;
        return ticketRepository.findByUserId(user.getId());
    }
    @RequestMapping(value="/concert/{id}/count", method = RequestMethod.GET)
    public long countTicketsByConcertId(@PathVariable("id") long id){
        return ticketRepository.countTicketByConcertId(id);
    }

    @RequestMapping(value="/concert/{id}", method = RequestMethod.GET)
    public List<Ticket> findTicketByConcertId(@PathVariable("id") long id){
        return ticketRepository.findByConcertId(id);
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Ticket> deleteAllTickets (){
        ticketRepository.deleteAll();
        return new ResponseEntity<Ticket>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_BAND') or hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Ticket> deleteTicket (@PathVariable("id") long id){
        Ticket ticket = ticketRepository.findById(id);
        if(ticket == null){
            System.out.println("Ticket not found");
            return new ResponseEntity<Ticket>(HttpStatus.NOT_FOUND);
        }
        User user = ticket.getUser();
        User band = userRepository.findByUsername(ticket.getBandName()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found"));;
        user.setAccountBalance(user.getAccountBalance()+ticket.getPrice());
        band.setAccountBalance(band.getAccountBalance()-ticket.getPrice());
        userRepository.save(user);
        userRepository.save(band);
        ticketRepository.deleteById(id);
        return new ResponseEntity<Ticket>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_BAND') or hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/concert/{concertId}", method = RequestMethod.POST)
    public ResponseEntity<Ticket> addTicket(@RequestBody Ticket ticket, @RequestParam String username, @PathVariable long concertId){
        User band = userRepository.findByUsername(ticket.getBandName()).orElseThrow(
                () -> new UsernameNotFoundException("Band Not Found"));;
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));;
        Concert concert = concertRepository.findById(concertId);
        if(band == null || concert == null || user == null){
            System.out.println("Couldn't find value");
            return new ResponseEntity<Ticket>(HttpStatus.NOT_FOUND);
        }
        if(band == user){
            System.out.println("You cannot reserve tickets for your own concert");
            return new ResponseEntity<Ticket>(HttpStatus.NO_CONTENT);
        }
        if(user.getAccountBalance()-ticket.getPrice() < 0){
            System.out.println("Not enough funds");
            return new ResponseEntity<Ticket>(HttpStatus.NO_CONTENT);
        }
        if(concert.getTicketCapacity() < ticketRepository.countTicketByConcertId(concertId)+1){
            System.out.println("Not enough capacity");
            return new ResponseEntity<Ticket>(HttpStatus.NO_CONTENT);
        }
        ticket.setUser(user);
        ticket.setConcert(concert);
        user.setAccountBalance(user.getAccountBalance()-ticket.getPrice());
        band.setAccountBalance(band.getAccountBalance()+ticket.getPrice());
        ticketRepository.save(ticket);
        userRepository.save(user);
        userRepository.save(band);
        return new ResponseEntity<Ticket>(ticket, HttpStatus.CREATED);
    }
}
