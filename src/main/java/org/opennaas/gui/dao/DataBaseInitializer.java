package org.opennaas.gui.dao;

import java.util.ArrayList;
import java.util.List;
import org.opennaas.gui.dao.user.UserDao;
import org.opennaas.gui.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Initialize the database with some test entries.
 *
 * @author Josep Batallé <josep.batalle@i2cat.net>
 */
public class DataBaseInitializer {

    private UserDao userDao;

    private PasswordEncoder passwordEncoder;

    protected DataBaseInitializer() {
        /* Default constructor for reflection instantiation */
    }

    public DataBaseInitializer(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public void initDataBase() {
        User userUser = new User("sp1", this.passwordEncoder.encode("sp"));
        userUser.addRole("user");
        userUser.addRole("sp");
        this.userDao.save(userUser);

        User adminUser = new User("ip", this.passwordEncoder.encode("ip"));
        adminUser.addRole("user");
        adminUser.addRole("admin");
        this.userDao.save(adminUser);

    }
}

