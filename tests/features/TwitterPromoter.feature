@Twitter
Feature: Twitter Promoter

  Scenario: Successfully send a tweet for each post
    Given a list of 2 posts to tweet
    And a limit of 5 tweets
    And a limit of 280 characters for tweets
    When I invoke the Twitter Promoter use case
    Then 2 tweets has been sent
