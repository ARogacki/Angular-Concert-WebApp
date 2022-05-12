package pl.dmcs.arogacki.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

@Entity
@Table(name="tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="concertId")
    private Concert concert;

    @NotBlank
    @Size(min = 2, max = 50)
    private String bandName;
    @NotBlank
    private Date date;
    @NotBlank
    private double price;

    public Ticket(){}
    public Ticket(Date date, double price, String bandName){
        this.date = date;
        this.price = price;
        this.bandName = bandName;
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

    public String getBandName() {
        return bandName;
    }

    public void setBandName(String bandName) {
        this.bandName = bandName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Concert getConcert() {
        return concert;
    }

    public void setConcert(Concert concert) {
        this.concert = concert;
    }
}
