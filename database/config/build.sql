BEGIN;
    DROP TABLE IF EXISTS users, products, categories, order_details, orders;
    CREATE TABLE users
    (
        id SERIAL PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    ALTER TABLE
    users ADD CONSTRAINT users_email_unique UNIQUE(email);

    CREATE TABLE categories
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE products
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price FLOAT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    ALTER TABLE products 
    ADD COLUMN status BOOLEAN;

    CREATE TABLE orders
    (
        id SERIAL PRIMARY KEY,
        amount FLOAT NOT NULL,
        user_id INT NOT NULL,
        status BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE order_details
    (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
        order_id INT NOT NULL,
        CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    INSERT INTO categories
        (name)
    VALUES
        ('type1'),
        ('type2'),
        ('type3'),
        ('type4'),
        ('type5');

    
    COMMIT;