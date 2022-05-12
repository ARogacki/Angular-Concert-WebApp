package pl.dmcs.arogacki.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="concerts")
public class Concert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private Date date;
    @NotBlank
    private String description;
    @NotBlank
    @Size(min = 2, max = 50)
    private String bandName;
    @NotBlank
    @Size(min = 2, max = 50)
    private String genre;
    @NotBlank
    private double price;
    @NotBlank
    private int ticketCapacity;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="bandId")
    private User band;

    @OneToMany(mappedBy = "concert", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Ticket> tickets;

    public Concert(){}
    public Concert(@NotBlank Date date, @NotBlank String description, @NotBlank String bandName, @NotBlank String genre,
                   @NotBlank double price, @NotBlank int ticketCapacity, User band){
        this.date = date;
        this.description = description;
        this.bandName = bandName;
        this.genre = genre;
        this.price = price;
        this.ticketCapacity = ticketCapacity;
        this.band = band;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBandName() {
        return bandName;
    }

    public void setBandName(String bandName) {
        this.bandName = bandName;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getTicketCapacity() {
        return ticketCapacity;
    }

    public void setTicketCapacity(int ticketCapacity) {
        this.ticketCapacity = ticketCapacity;
    }

    public User getBand() {
        return band;
    }

    public void setBand(User band) {
        this.band = band;
    }
}
