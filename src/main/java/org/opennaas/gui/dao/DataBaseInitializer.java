package org.opennaas.gui.dao;

import org.opennaas.gui.dao.history.HistoryEntryDao;
import org.opennaas.gui.dao.user.UserDao;
import org.opennaas.gui.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Initialize the database with some test entries.
 *
 * @author Philip W. Sorst <philip@sorst.net>
 */
public class DataBaseInitializer {

    private HistoryEntryDao historyEntryDao;

    private UserDao userDao;

    private PasswordEncoder passwordEncoder;

    protected DataBaseInitializer() {
        /* Default constructor for reflection instantiation */
    }

    public DataBaseInitializer(UserDao userDao, HistoryEntryDao historyEntryDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.historyEntryDao = historyEntryDao;
        this.passwordEncoder = passwordEncoder;
    }

    public void initDataBase() {
        User userUser = new User("user", this.passwordEncoder.encode("user"));
        userUser.addRole("user");
        this.userDao.save(userUser);

        User adminUser = new User("admin", this.passwordEncoder.encode("admin"));
        adminUser.addRole("user");
        adminUser.addRole("admin");
        this.userDao.save(adminUser);

    }
}
