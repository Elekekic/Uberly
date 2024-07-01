package Elena.Uberly_backend.Entity;

import Elena.Uberly_backend.Enum.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String name;
    private String surname;
    private String email;
    private String password;
    private String bio;
    private String pictureProfile;
    private String pronouns;


    @OneToMany(mappedBy = "author", orphanRemoval = true)
    private List<Feedback> feedbacksAuthored = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", orphanRemoval = true)
    private List<Feedback> feedbacksReceived = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIncludeProperties(value = {"id", "title", "description", "startingPoint", "endPoint", "spacesDrivers", "tag", "comments"})
    private List<Post> posts = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    @JsonIncludeProperties(value = {"id", "title", "description", "spacesRiders", "startingPoint", "endPoint", "spacesDrivers", "tag", "user", "vehicle", "comments", "reactions", "usersWhoSaved", })
    private List<Post> favorites = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "saved_memes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "meme_id")
    )
    private List<Meme> favoritesMemes = new ArrayList<>();


    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @JsonIncludeProperties(value = {"id", "url", "user"})
    private List<Meme> memes = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    @JsonIncludeProperties(value = {"username", "pictureProfile"})
    private List<User> followers = new ArrayList<>();

    @ManyToMany(mappedBy = "followers")
    @JsonIncludeProperties(value = {"username", "pictureProfile"})
    private List<User> following = new ArrayList<>();

    public void followUser(User user) {
        following.add(user);
        user.getFollowers().add(this);
    }

    public void unfollowUser(User user) {
        following.remove(user);
        user.getFollowers().remove(this);
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
