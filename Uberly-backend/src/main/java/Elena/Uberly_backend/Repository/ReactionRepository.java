package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Integer> {

    Optional<Post> findByPostId(int postId);
}
