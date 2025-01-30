-- Insert the following new record to the account table
INSERT into account(
        account_firstname,
        account_lastame,
        account_email,
        account_password
    )
values(
        'Tony',
        'Stark',
        'tonny@starknet.com',
        'Iam1ronM@n'
    );


-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tonny';


-- Delete the Tony Stark record from the database.
DELETE from account
WHERE account_firstname = 'Tonny';


-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query. 
UPDATE inventory
set inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
where inv_id = 10;
select *
from inventory
where inv_id = 10;


-- Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category
SELECT inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Spot';


-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query
UPDATE inventory
SET inv_image = CONCAT(
        SUBSTRING(
            inv_image
            FROM 1 FOR POSITION('/' IN inv_image) + POSITION(
                    '/' IN SUBSTRING(
                        inv_image
                        FROM POSITION('/' IN inv_image) + 1
                    )
                )
        ),
        'vehicles/',
        SUBSTRING(
            inv_image
            FROM POSITION('/' IN inv_image) + POSITION(
                    '/' IN SUBSTRING(
                        inv_image
                        FROM POSITION('/' IN inv_image) + 1
                    )
                ) + 1
        )
    ),
    inv_thumbnail = CONCAT(
        SUBSTRING(
            inv_thumbnail
            FROM 1 FOR POSITION('/' IN inv_thumbnail) + POSITION(
                    '/' IN SUBSTRING(
                        inv_thumbnail
                        FROM POSITION('/' IN inv_thumbnail) + 1
                    )
                )
        ),
        'vehicles/',
        SUBSTRING(
            inv_thumbnail
            FROM POSITION('/' IN inv_thumbnail) + POSITION(
                    '/' IN SUBSTRING(
                        inv_thumbnail
                        FROM POSITION('/' IN inv_thumbnail) + 1
                    )
                ) + 1
        )
    );