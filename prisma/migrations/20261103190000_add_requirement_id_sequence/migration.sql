-- Create a sequence for generating requirement IDs
CREATE SEQUENCE requirement_id_seq
START WITH 1
INCREMENT BY 1;

-- Initialize the sequence using the highest existing requirement ID
SELECT setval(
    'requirement_id_seq',
    COALESCE(
        (
            SELECT MAX(
                substring("requirementId" FROM '^REQ-([0-9]+)$')::INTEGER
            )
            FROM "Requirement"
        ),
        0
    ) + 1,
    false
);