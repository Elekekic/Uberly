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

    @ElementCollection(targetClass = Tags.class)
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<Tags> tags = new ArrayList<>();

    private String vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIncludeProperties(value = {"id","name", "username", "pictureProfile","role"})
    private User user;
    
    @OneToMany(mappedBy = "post", orphanRemoval = true)
    @JsonIncludeProperties(value = {"id", "content", "user", "replies", "reactions"})
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", orphanRemoval = true)
    @JsonManagedReference
    private List<Reaction> reactions = new ArrayList<>();

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    @JsonIncludeProperties(value = {"id", "username", "pictureProfile"})
    private List<User> usersWhoSaved = new ArrayList<>();

}
