package pl.dmcs.arogacki.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.arogacki.model.Role;
import pl.dmcs.arogacki.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //User findByUsername(String username);
    Optional<User> findByUsername(String username);
    User findById(long id);
    Boolean existsByUsername(String username);

    List<User> findAllByRolesIsNotContaining(Optional<Role> byName, Sort sort);
}
