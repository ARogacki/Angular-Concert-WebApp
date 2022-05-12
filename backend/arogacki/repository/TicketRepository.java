package pl.dmcs.arogacki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.arogacki.model.Ticket;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Ticket findById(long id);
    List<Ticket> findByUserId(long userId);
    List<Ticket> findByConcertId(long concertId);
    long countTicketByConcertId(long concertId);
}
