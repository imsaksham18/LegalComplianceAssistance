CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
role VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE policies (
policy_id SERIAL PRIMARY KEY,
title VARCHAR(255),
category VARCHAR(100),
description TEXT,
file_path VARCHAR(500),
uploaded_by INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE regulations (
regulation_id SERIAL PRIMARY KEY,
title VARCHAR(255),
regulation_code VARCHAR(100),
category VARCHAR(100),
description TEXT,
effective_date DATE
);
 
CREATE TABLE compliance_checks (
check_id SERIAL PRIMARY KEY,
policy_id INT,
regulation_id INT,
status VARCHAR(50),
risk_score DECIMAL(5,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE reports (
report_id SERIAL PRIMARY KEY,
check_id INT,
summary TEXT,
recommendation TEXT,
generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);