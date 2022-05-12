package pl.dmcs.arogacki.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.arogacki.model.*;
import pl.dmcs.arogacki.repository.ConcertRepository;
import pl.dmcs.arogacki.repository.RoleRepository;
import pl.dmcs.arogacki.repository.TicketRepository;
import pl.dmcs.arogacki.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/restApi/user")
public class UserRESTController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ConcertRepository concertRepository;

    @RequestMapping(method = RequestMethod.GET)
    public List<User> listAllUsers(){
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "enabled"));
    }
    @RequestMapping(value = "/disabled", method = RequestMethod.GET)
    public List<User> listAllUsersByDisabled(){
        return userRepository.findAll(Sort.by(Sort.Order.asc("enabled"), Sort.Order.asc("id")));
    }
    @RequestMapping(value="/adminList", method = RequestMethod.GET)
    public List<User> listAllExceptAdmin(){
        return userRepository.findAllByRolesIsNotContaining(roleRepository.findByName(RoleName.ROLE_ADMIN), Sort.by(Sort.Order.asc("enabled"), Sort.Order.asc("id")));
    }
    @RequestMapping(value="/{username}", method = RequestMethod.GET)
    public User findUserByUsername(@PathVariable("username") String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));
        return user;
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/changeState/{username}", method = RequestMethod.PATCH)
    public ResponseEntity<User> changeStateByUsername(@PathVariable("username") String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));;
        if (user.getEnabled())
            user.setEnabled(false);
        else
            user.setEnabled(true);
        userRepository.save(user);
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{username}", method = RequestMethod.PATCH)
    public ResponseEntity<User> editProfile(@RequestBody Map<String, Object> updates, @PathVariable("username") String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));
        updateProfile(user, updates);
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value="/{username}", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteUserByUsername(@PathVariable("username") String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + username));
        List<Ticket> userTickets = ticketRepository.findByUserId(user.getId());
        iterateOverTickets(userTickets);
        if (user.getRoles().contains(roleRepository.findById(3))){
            List<Concert> concerts = concertRepository.findByBandId(user.getId());
            for(int i=0; i<concerts.size(); i++){
                List<Ticket> bandTickets = ticketRepository.findByConcertId(concerts.get(i).getId());
                iterateOverTickets(bandTickets);
            }
        }
        userRepository.deleteById(user.getId());
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }
    private void iterateOverTickets(List<Ticket> tickets){
        for(int i=0; i<tickets.size(); i++){
            User owner = tickets.get(i).getUser();
            User band = userRepository.findByUsername(tickets.get(i).getBandName()).orElseThrow(
                    () -> new UsernameNotFoundException("User Not Found"));
            if(owner != null && band != null) {
                refundMoney(tickets.get(i), owner, band);
            }
        }
    }
    private void refundMoney(Ticket ticket, User user, User band){
        user.setAccountBalance(user.getAccountBalance()+ticket.getPrice());
        band.setAccountBalance(band.getAccountBalance()-ticket.getPrice());
        userRepository.save(user);
        userRepository.save(band);
    }
    private void updateProfile(User user, Map<String, Object> updates){
        if(updates.containsKey("name")){
            user.setName((String) updates.get("name"));
        }
        if(updates.containsKey("lastName")){
            user.setLastName((String) updates.get("lastName"));
        }
        if(updates.containsKey("publicProfile")){
            //depends on whether this works
            user.setPublicProfile((boolean) updates.get("publicProfile"));
        }
        if(updates.containsKey("description")){
            user.setDescription((String) updates.get("description"));
        }
        userRepository.save(user);
    }
}
