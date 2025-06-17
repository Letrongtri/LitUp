-- ATTACHMENTS TABLE
CREATE TABLE Attachments (
    fid SERIAL PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    f_original_name VARCHAR(255) NOT NULL,
    f_type VARCHAR(50),
    f_size BIGINT,
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS TABLE
CREATE TABLE Users (
    uid SERIAL PRIMARY KEY,
    u_avatar_id INT DEFAULT NULL,
    u_email VARCHAR(255) UNIQUE NOT NULL,
    u_first_name VARCHAR(100) NOT NULL,
    u_last_name VARCHAR(100) NOT NULL,
    u_password CHAR(255) NOT NULL,
    u_role VARCHAR(10) NOT NULL,
    u_status BOOLEAN DEFAULT TRUE,
    u_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    u_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (u_avatar_id) REFERENCES Attachments(fid) ON DELETE SET NULL
);

-- CLASSROOMS TABLE
CREATE TABLE Classrooms (
    cid SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    c_name VARCHAR(255) NOT NULL,
    c_code CHAR(6) UNIQUE NOT NULL,
    c_status BOOLEAN DEFAULT TRUE,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    c_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE SET NULL
);

-- MEMBERS TABLE
CREATE TABLE Members (
    mid SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    cid INT NOT NULL,
    m_status BOOLEAN DEFAULT TRUE,
    m_joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    m_removed_at TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (cid) REFERENCES Classrooms(cid) ON DELETE CASCADE
);

-- ASSIGNMENTS TABLE
CREATE TABLE Assignments (
    aid SERIAL PRIMARY KEY,
    cid INT NOT NULL,
    a_title VARCHAR(255) NOT NULL,
    a_description TEXT,
    a_max_points FLOAT,
    a_status BOOLEAN DEFAULT TRUE,
    a_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    a_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    a_deadline_at TIMESTAMP,
    a_allow_late_submission BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cid) REFERENCES Classrooms(cid) ON DELETE CASCADE
);

-- SUBMISSIONS TABLE
CREATE TABLE Submissions (
    sid SERIAL PRIMARY KEY,
    aid INT NOT NULL,
    uid INT NOT NULL,
    s_status VARCHAR(10),
    s_submitted_at TIMESTAMP,
    s_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    s_grade FLOAT,
    s_comment TEXT,
    s_graded_at TIMESTAMP,
    FOREIGN KEY (aid) REFERENCES Assignments(aid) ON DELETE RESTRICT,
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE SET NULL
);

-- SUBMISSION_ATTACHMENTS TABLE (many-to-many)
CREATE TABLE Submission_Attachments (
    sid INT NOT NULL,
    fid INT NOT NULL,
    PRIMARY KEY (sid, fid),
    FOREIGN KEY (sid) REFERENCES Submissions(sid) ON DELETE CASCADE,
    FOREIGN KEY (fid) REFERENCES Attachments(fid) ON DELETE CASCADE
);

-- ASSIGNMENT_ATTACHMENTS TABLE (many-to-many)
CREATE TABLE Assignment_Attachments (
    fid INT NOT NULL,
    aid INT NOT NULL,
    PRIMARY KEY (fid, aid),
    FOREIGN KEY (fid) REFERENCES Attachments(fid) ON DELETE CASCADE,
    FOREIGN KEY (aid) REFERENCES Assignments(aid) ON DELETE CASCADE
);

-- password: abc123
update users set u_password = '$2b$10$upaNUUJbE/IW/9NiCsLg0erT6PVEgB6CQkNJ84HHcFxevNQYNh.nK' where uid < 200;