package pl.dmcs.arogacki.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/restApi/concert")
public class ConcertRESTController {
    final static int PAGES = 6;
    @Autowired
    private ConcertRepository concertRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    public Page<Concert> listAllConcerts(@RequestParam(defaultValue = "", name="search") String search,
                                      @RequestParam(defaultValue = "ASC", name="order") String order,
                                      @RequestParam(defaultValue = "id", name="sort") String sort,
                                      @RequestParam(defaultValue = "0", name="page") int page){
        order = order.toUpperCase();
        if(!search.isEmpty()) {
            return concertRepository.findAllByBandNameIsContainingIgnoreCase(search, PageRequest.of(page, PAGES, Sort.by(Sort.Direction.valueOf(order), sort)));
        }
        return concertRepository.findAll(PageRequest.of(page, PAGES, Sort.by(Sort.Direction.valueOf(order), sort)));
    }
    @RequestMapping(value="/{id}", method = RequestMethod.GET)
    public Concert findConcertById(@PathVariable("id") long id){
        return concertRepository.findById(id);
    }
    @RequestMapping(value="/band/{id}", method = RequestMethod.GET)
    public List<Concert> findConcertByBandId(@PathVariable("id") long id){
        return concertRepository.findByBandId(id);
    }
    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Concert> deleteAllConcerts (){
        concertRepository.deleteAll();
        return new ResponseEntity<Concert>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_BAND') or hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Concert> deleteConcert (@PathVariable("id") long id){
        Concert concert = concertRepository.findById(id);
        if(concert == null){
            System.out.println("Concert not found");
            return new ResponseEntity<Concert>(HttpStatus.NOT_FOUND);
        }
        List<Ticket> tickets = ticketRepository.findByConcertId(concert.getId());
        for(int i=0; i<tickets.size(); i++){
            User owner = tickets.get(i).getUser();
            User band = userRepository.findByUsername(tickets.get(i).getBandName()).orElseThrow(
                    () -> new UsernameNotFoundException("User Not Found"));;
            if(owner != null && band != null) {
                refundMoney(tickets.get(i), owner, band);
            }
        }
        concertRepository.deleteById(id);
        return new ResponseEntity<Concert>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_BAND') or hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<Concert> updateConcert (@RequestBody Map<String, Object> updates,@PathVariable("id") long id){
        Concert concert = concertRepository.findById(id);
        if(concert == null){
            System.out.println("Concert not found");
            return new ResponseEntity<Concert>(HttpStatus.NOT_FOUND);
        }
        updateConcert(concert, updates);
        return new ResponseEntity<Concert>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_BAND') or hasRole('ROLE_ADMIN')")
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Concert> addConcert(@RequestBody Concert concert){
        User user = userRepository.findByUsername(concert.getBandName()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found"));;
        concert.setBand(user);
        concertRepository.save(concert);
        return new ResponseEntity<Concert>(concert, HttpStatus.CREATED);
    }
    private void refundMoney(Ticket ticket, User user, User band){
        user.setAccountBalance(user.getAccountBalance()+ticket.getPrice());
        band.setAccountBalance(band.getAccountBalance()-ticket.getPrice());
        userRepository.save(user);
        userRepository.save(band);
    }
    private void updateConcert(Concert concert, Map<String, Object> updates){
        if(updates.containsKey("description")){
            concert.setDescription((String) updates.get("description"));
        }
        if(updates.containsKey("genre")){
            concert.setGenre((String) updates.get("genre"));
        }
        concertRepository.save(concert);
    }
}
