package Elena.Uberly_backend.Entity;

import Elena.Uberly_backend.Enum.Tags;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "memes")
public class Meme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private Tags tag;

    private String url;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIncludeProperties(value = {"id","name", "username", "surname", "pictureProfile","role"})
    private User user;

    @OneToMany(mappedBy = "meme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIncludeProperties(value = {"id", "content", "user", "replies", "reactions"})
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "meme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Reaction> reactions = new ArrayList<>();

    @ManyToMany(mappedBy = "favoritesMemes", fetch = FetchType.LAZY)
    @JsonIncludeProperties(value = {"id", "username", "pictureProfile"})
    private List<User> usersWhoSaved = new ArrayList<>();

}
