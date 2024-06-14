package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.Entity.Meme;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Enum.Tags;
import Elena.Uberly_backend.Exception.MemeNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.MemeRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class MemeService {

    @Autowired
    private MemeRepository memeRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private UserRepository userRepository;

    // GET ALL MEMES METHOD
    public List<Meme> getAllMemes() {
        return memeRepository.findAll();
    }

    // GET ALL MEMES BY USER ID METHOD
    public List<Meme> getAllMemesByUserId(int userId) {
        return memeRepository.findAllByUserId(userId);
    }


    // GET MEME BY ID METHOD
    public Optional<Meme> findMemeById(int id) {
        Optional<Meme> memeOptional = memeRepository.findById(id);
        if (memeOptional.isPresent()) {
            return memeRepository.findById(id);
        } else {
            throw new MemeNotFoundException("Meme with ID: " + id + " not found");
        }
    }


// SAVE MEME METHOD
public String saveMeme(int id, MultipartFile url) throws IOException {
    Optional<User> userOptional = userRepository.findById(id);
    if (userOptional.isPresent()) {
        Meme meme = new Meme();
        String urlPicture = (String) cloudinary.uploader().upload(url.getBytes(), Collections.emptyMap()).get("url");
        meme.setUrl(urlPicture);
        meme.setTag(Tags.MEMES);
        meme.setUser(userOptional.get());
        memeRepository.save(meme);
        return "Meme saved successfully";
    } else {
        throw new MemeNotFoundException("Impossible to save meme, meme with id: " + id + " not found");
    }
}


// UPDATE MEME METHOD
public String patchMemeUrl(int id, MultipartFile url) throws UserNotFoundException, IOException {
    Optional<Meme> memesOptional = memeRepository.findById(id);
    if (memesOptional.isPresent()) {
        String urlPicture = (String) cloudinary.uploader().upload(url.getBytes(), Collections.emptyMap()).get("url");
        Meme meme = memesOptional.get();
        meme.setUrl(urlPicture);
        meme.setTag(Tags.MEMES);
        memeRepository.save(meme);
        return "Meme updated successfully";
    } else {
        throw new MemeNotFoundException("Impossible to save meme, meme with id: " + id + " not found");
    }
}


// DELETE MEME METHOD
public String deleteMeme(int id) {
    Optional<Meme> memesOptional = memeRepository.findById(id);
    if (memesOptional.isPresent()) {
        memeRepository.deleteById(id);
        return "Meme deleted successfully";
    } else {
        throw new MemeNotFoundException("Meme with ID: " + id + " not found");
    }
}

}
