package Elena.Uberly_backend.Entity;

import Elena.Uberly_backend.Enum.Tags;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String description;

    @Column(name = "starting_point")
    private String startingPoint;

    @Column(name = "end_point")
    private String endPoint;

    @Column(name = "spaces_riders")
    private int spacesRiders;

    @Enumerated(EnumType.STRING)
    private Tags tag;

    private String car;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIncludeProperties(value = {"name", "username", "pictureProfile"})
    private User user;


    @OneToMany(mappedBy = "post", orphanRemoval = true)
    @JsonIncludeProperties(value = {"id", "content", "user", "parentComment", "reactions"})
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", orphanRemoval = true)
    @JsonManagedReference
    private List<Reaction> reactions = new ArrayList<>();

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    @JsonIncludeProperties(value = {"id", "username", "pictureProfile"})
    private List<User> usersWhoSaved = new ArrayList<>();

}
