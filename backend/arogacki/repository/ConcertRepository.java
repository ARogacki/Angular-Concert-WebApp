package pl.dmcs.arogacki.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.dmcs.arogacki.model.Concert;

import java.util.List;

public interface ConcertRepository extends JpaRepository<Concert, Long> {
    Concert findById(long id);
    List<Concert> findByBandId(long id);

    //@Query("SELECT * FROM concerts WHERE concerts.date < :today")
    //@Query(value = "SELECT * FROM concerts WHERE concerts.date > current_date", nativeQuery = true)
    //List<Concert> findAllByDate();

    Page<Concert> findAllByBandName(String search, Pageable pageable);
    Page<Concert> findAllByBandNameIsContainingIgnoreCase(String search, Pageable pageable);
}
