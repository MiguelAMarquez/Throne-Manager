package uru.login.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "king")
public class King {
    @Id
    private String id;
    private String title;
    private String password;
    private String name;
    private String lastname;
    private String horn; // Phone Number
    private String scroll; // Email
    private List<Courtier> courtiers;
    private List<Court> courts;

    @Getter
    @Setter
    public static class Courtier {
        private String name;
        private String lastname;
        private String horn;
        private String scroll;
        private List<String> courts;
    }

    @Getter
    @Setter
    public static class Court {
        private String courtName;
        private List<Courtier> members;
    }
}
