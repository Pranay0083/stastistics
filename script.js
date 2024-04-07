let username = "";
function main() { // Replace 'codeforces_handle' with the actual username
    const userInfoUrl = `https://codeforces.com/api/user.info?handles=${username}`;
    console.log(username);

    // Fetch user information and update the user details table
    fetch(userInfoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const user = data.result[0]; // Assuming there's only one user in the result array

                // Populate user details in the userDetailsTable
                populateTableRow('userDetailsTable', 'User Name', user.handle);
                populateTableRow('userDetailsTable', 'Rating', user.rating);
                populateTableRow('userDetailsTable', 'Rank', user.rank);

                // Proceed to fetch user's submissions and contests
                fetchUserSubmissions(user.handle);
                fetchUserContests(user.handle);
            } else {
                console.error('API Error:', data.comment);
            }
        })
        .catch(error => {
            console.error('API Request Failed:', error);
        });

    // Function to populate a table row with data
    function populateTableRow(tableId, category, value) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        const newRow = tableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const valueCell = newRow.insertCell();

        categoryCell.textContent = category;
        valueCell.textContent = value;
    }

    // Fetch user submissions and update the topicStatsTable
    function fetchUserSubmissions(handle) {
        const userStatusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;

        fetch(userStatusUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const submissions = data.result;

                    // Filter solved submissions
                    const solvedSubmissions = submissions.filter(submission => submission.verdict === 'OK');

                    // Calculate number of solved questions per topic
                    const topicCounts = new Map(); // Map to store topic counts
                    solvedSubmissions.forEach(submission => {
                        if (submission.problem.tags) {
                            submission.problem.tags.forEach(tag => {
                                if (!topicCounts.has(tag)) {
                                    topicCounts.set(tag, 0);
                                }
                                topicCounts.set(tag, topicCounts.get(tag) + 1);
                            });
                        }
                    });

                    // Filter topics with less than 10 questions solved
                    const filteredTopicCounts = new Map(
                        [...topicCounts].filter(([topic, count]) => count >= 10)
                    );

                    // Populate topics and their counts in the topicStatsTable
                    filteredTopicCounts.forEach((count, topic) => {
                        populateTableRow('topicStatsTable', topic, count);
                    });
                } else {
                    console.error('API Error:', data.comment);
                }
            })
            .catch(error => {
                console.error('API Request Failed:', error);
            });
    }

    // Fetch user contests and update the userDetailsTable
    function fetchUserContests(handle) {
        const userRatingUrl = `https://codeforces.com/api/user.rating?handle=${handle}`;

        fetch(userRatingUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const contests = data.result;

                    // Calculate user contest statistics
                    const numContests = contests.length;
                    const bestRank = Math.min(...contests.map(contest => contest.rank));
                    const worstRank = Math.max(...contests.map(contest => contest.rank));

                    // Populate contest statistics in the userDetailsTable
                    populateTableRow('userDetailsTable', 'Contests Participated', numContests);
                    populateTableRow('userDetailsTable', 'Best Rank', bestRank);
                    populateTableRow('userDetailsTable', 'Worst Rank', worstRank);
                } else {
                    console.error('API Error:', data.comment);
                }
            })
            .catch(error => {
                console.error('API Request Failed:', error);
            });
    }
}

function getUsername(){
    
    console.log(document.querySelector('#username').value);
    username = document.querySelector('#username').value;
    document.querySelector('.giveName').innerHTML = "";
    document.querySelector('.giveName').style.backgroundColor = "rgba(0, 0, 0, 0)";

    main();
}
