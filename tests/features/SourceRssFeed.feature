@Rss
Feature: Rss Feed as source of news

  Scenario: Successfully retrieve post from rss feed
    Given a list of 5 publications in Rss Feed
    When I invoke the Source Rss use case
    Then 5 publications has been notified
