in creating course, if course code already exists, throw error that the course exists

IN create-exam slot endpoint, make sure that dupicate slots are not created for the same course

    Look at that get exam slots endpoint again.

    My logic: If a course can have only one slot, then the endpoint for get available slots in not necessary

    New logic: Each course has its own slo with its own slotId

    TEST REschedule logic
    My question: How does the make payment flow work?

    examine the endpoint for getting student's exam schedule again