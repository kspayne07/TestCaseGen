-- Create a sequence for generating Test Case IDs
CREATE SEQUENCE test_case_id_seq
START WITH 1
INCREMENT BY 1;

-- Initialize the sequence using the highest existing Test Case ID
SELECT setval(
    'test_case_id_seq',
    COALESCE(
        (
            SELECT MAX(
                substring("testCaseId" FROM '^TC-([0-9]+)$')::INTEGER
            )
            FROM "TestCase"
        ),
        0
    ) + 1,
    false
);
