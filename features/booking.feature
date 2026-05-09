Feature: Cinema ticket booking

  Scenario: User can book one ticket
    Given user is on cinema page
    When user selects day 2
    And user selects movie 0 and session 0
    And user selects an available seat
    And user clicks booking button
    Then user sees selected tickets page

  Scenario: User can get booking code button
    Given user is on cinema page
    When user selects day 3
    And user selects movie 0 and session 0
    And user selects an available seat
    And user clicks booking button
    Then user sees booking code button

  Scenario: User cannot book ticket without selecting seat
    Given user is on cinema page
    When user selects day 1
    And user selects movie 0 and session 0
    Then booking button is disabled