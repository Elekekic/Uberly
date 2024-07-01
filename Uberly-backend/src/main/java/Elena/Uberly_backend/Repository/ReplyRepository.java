package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    List<Reply> findByCommentId(int commentId);

    List<Reply> findByUserId(int userId);
}
