package pl.dmcs.arogacki.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    @Size(min = 3, max = 50)
    private String email;
    private String name;
    private String lastName;
    private Boolean publicProfile;
    private String description;
    private Boolean enabled;
    private double accountBalance;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "band", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Concert> concerts;

    public User(){
    }

    public User(@NotBlank @Size(min = 3, max = 50) String username,
                @NotBlank @Size(min = 3, max = 100) String password,
                @NotBlank @Size(min = 3, max = 50) String email,
                boolean enabled,
                boolean publicProfile) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.enabled = enabled;
        this.publicProfile = publicProfile;
        this.accountBalance = 500;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getPublicProfile() {
        return publicProfile;
    }

    public void setPublicProfile(Boolean publicProfile) {
        this.publicProfile = publicProfile;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public double getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(double accountBalance) {
        this.accountBalance = accountBalance;
    }
}
