@Telegram
Feature: Telegram Promoter

  Scenario: Successfully send a list of telegram messages
    Given a list of "2" posts
    And a limit of "5" telegram messages
    When I invoke the Telegram Promoter use case
    Then 2 telegram messages should have been sent

  Scenario: When posts list is empty, no message should be sent
    Given an empty list of posts
    When I invoke the Telegram Promoter use case
    Then no message should be sent

  Scenario: It receive more posts of what it's allowed to send
    Given a list of "7" posts
    And a limit of "5" telegram messages
    When I invoke the Telegram Promoter use case
    Then 5 telegram messages should have been sent
