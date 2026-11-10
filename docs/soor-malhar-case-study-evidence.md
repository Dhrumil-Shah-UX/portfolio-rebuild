# Soor Malhar case-study evidence

Source: https://docs.google.com/document/d/1hfEzwyqcRw54NyaoS7_Gg3wZdSWGiVsRpV5feabLjZg/edit?tab=t.0

Reviewed: 2026-11-10. Source document left unchanged.

## Evidence boundaries

- User explicitly confirmed no AI tools were used on this project.
- Original portfolio record supplies UX/UI Design Intern, May–June 2021, Figma, Android Studio, Jetpack Compose, approximately 20 explored/redesigned screens and 8 core Compose UI screens. The user did not independently reconfirm the screen counts in the clarification; the public page attributes them to the existing record.
- No participant counts, formal testing protocol, measured engagement improvement, production deployment, backend integration or accessibility conformance claim is established. The old unsupported 15% figure remains excluded.
- Original/iteration/final labels follow the source document's image placement and accompanying explanation, not guesses from screenshot polish.
- Example ratings, enrollments, prices, comments and progress values belong to the historical UI mockups and are not redesign outcomes.
- Social sign-in and voice search were deferred feature suggestions. XP/completion and other secondary concepts are labeled explorations rather than shipped functionality.
- The Figma redesign images are not represented as screenshots of the Compose implementation. No matched implementation captures were available.
- Existing affinity synthesis is included with its research-method/sample-size limitation. No invented user test or preference result is attached.

## Preserved assets

All 70 source image objects are retained in assets/images/case-studies/soor-malhar. source-manifest.json maps stable Google Docs object IDs and paragraph anchors to local filenames, without temporary signed image URLs. The original portfolio mockup and affinity artifact are retained as redesign-overview.png and research-affinity.png. The external source link preserves access to the complete annotated source layout.

## Implementation scope

Only Soor case-study markup, an isolated stylesheet, a guarded viewer script, source evidence and assets were added/changed. index.html has one script reference; the script does nothing without the Soor root. Other case-study files and existing dirty work remain untouched.

## Validation

- Visually reviewed the complete case study at 1440px desktop and 390px mobile, plus a 768px tablet render. Reviewed each decision separately at reading size and corrected oversized images and mobile comparisons after the first render.
- No horizontal overflow at 320, 390, 768 or 1440px. All displayed images loaded; no browser JavaScript errors.
- Tested four-section navigation, full-screen viewer, cursor-centered wheel zoom, keyboard zoom/reset, real browser touch-pinch input, top-right Close, Escape, focus and body-scroll restoration, and automatic viewer cleanup when leaving the route.
- Other case-study routes remain functional. Static build, JavaScript syntax, diff whitespace checks and all 55 existing assistant tests pass.
- The repository-wide case-study placeholder checker remains blocked by pre-existing placeholders in pages/case-azhartt.html only. Soor Malhar contains no unresolved placeholders or accordions.

## Read-only source transcript

The following nonblank paragraph text is preserved to retain details beyond the concise public narrative. Paragraph anchors refer to the original Google Doc. Images and positioned annotations remain available in the original document and local source manifest.

### Source paragraph 1

Case Study: Soor Malhar App Redesign

### Source paragraph 40

Core Screens

### Source paragraph 53

Sign Up Page

### Source paragraph 66

Original screen						                      Version 1                			                                 Final Version

### Source paragraph 236

Version 1:

### Source paragraph 247

The logo is made small to provide more space for the form on the screen and enables the user to scroll less. A toggle visibility icon is added for the password to reduce error possibilities. Additional field “Confirm password” is added so that the user’s intentional password and typing mistake gets checked while creating the account and if the user ignores the visibility icon in haste

### Source paragraph 636

Final Version:

### Source paragraph 651

The icon was made smaller in the previous version so that users would not have to scroll much for the fields. But this was resulting in a problem for the users to make efforts in reaching their thumb for the upper half of the screen and so this idea is removed and it is decided to keep the size of the logo as that of the original screen. There could have been an option of adding an extra field of confirm password but according to usability research experts, typing passwords is more difficult on mobile because it involves switching keyboards to access numerical or special characters. Entering a password character on mobile takes almost twice as much time than on the desktop, and as a result people tend to create weaker passwords on mobile. Due to this reason, making them write passwords twice is not recommendable.

### Source paragraph 1476

There are some additional changes done in this version. The fields which will be focused for the users to type in will have highlighted outlines to let user have the convenient visibility of the system. For the error messages, a modal dialog box was displayed in which all the errors were mentioned. In this, there were 3 problems:

### Source paragraph 1808

1) 	Users had to remember the errors as the dialog box disappeared while typing in the fields.

### Source paragraph 1903

2) 	Users had to make extra efforts to tap OK on the dialog box to make it disappear and continue the work.

### Source paragraph 2011

3) 	Users also had to remember the fields in which there were errors.

### Source paragraph 2081

For these reasons, the modal dialog box concept is removed. In the new concept, the error messages will appear just below the respective errored fields. The fields having errors will be highlighted with a red outline denoting error. In this way, the users can directly continue with their work on errored fields without remembering the errors or fields containing errors or making any extra effort of tapping OK button as in modal dialog boxes.

### Source paragraph 2526

There was one hidden thing about the password field. The password needs at least 6 characters. Now, if the users create a password of more than 6 characters straight away, it’s good. But if they create a password of less than 6 characters, they will get to know about it only when they see it in the error message. They will then have to remake the password. To avoid that and prevent the burden on users, hints can be given with the field as it is given in this version for the password. The hints and labels are provided outside of the text field because they will then disappear during typing and then the users will have to remember and recall the hints for further actions.

### Source paragraph 3212

Log In Page

### Source paragraph 3224

Original screen			 	                                      Version 1                                                                    Final Version

### Source paragraph 3432

Version 1:

### Source paragraph 3443

Small logo is considered similar to the Sign Up page. Additional options of signing in to the app are given (Sign in through google/Facebook) so that the users don’t have to remember passwords and can get to the home screen of the app as quickly as possible. The password visibility toggle icon is again added here.

### Source paragraph 3760

Final Version:

### Source paragraph 3775

Similar to the sign up screen, the original size of logo has been retained in version 2 for the same reason. The modal dialogue boxes feature has been removed and error specification has been set under the text fields in red whenever the errors occur. The password visibility feature will be visible by default as a person can easily hide the mobile device while typing password and enabling it by default helps the user to see the password and avoid mistakes in typing and thus reduces the burden of the user. The text size of ‘Forgot Password?’ has been retained of the original size and the space between the Log In button and Forgot Password has also been retained as the reduced space led to the Fat Finger issue (the tapping area is so small between elements that the finger tap triggers an action different from what was intended). The added features of signing in through google/ facebook has been removed and it will be suggested to the company in an Extra Feature Suggestion List.

### Source paragraph 4781

The focus will help the user to locate the active field easily.

### Source paragraph 4847

Modal dialog box can be closed only by tapping on OK button which increases the stress on the users to reach that button and also, the users have to remember the field containing the error and the error itself. These lackings have been overcome here as the errors in the new screen will be showed below the text field with a red text field border highlight.

### Source paragraph 5206

Bottom Navigation Bar

### Source paragraph 5229

Original bottom bar    														    New bottom bar

### Source paragraph 5293

According to the Material Design standards, if there are 5 destinations in a bottom App bar, then it is favourable to include text label to only the active destination. A new destination has been added named ‘My Classes’ which includes the courses that are enrolled by the user. The notification screen will be accessed from the Top App bar rather than Bottom Navigation Bar.

### Source paragraph 5671

No Internet Page

### Source paragraph 5692

Original screen	                                                               Version 1		                                                         Final Version

### Source paragraph 5916

Version 1:

### Source paragraph 5927

The text ‘Please check your internet connection’ overlapped with the try again button. This is avoided by adding space between them both. The symbol of circle and exclamation in it did not give the idea about the error. For that, a new symbol has been added. It was unrecognizable that the try again was a button to refresh the page. For that too, a different symbol has been introduced. The spacing is set as per the thumb reachability of the user for the try again button.

### Source paragraph 6402

Final Version:

### Source paragraph 6417

The saturation of the wifi symbol is reduced along with its text so that it does not confuse the user if it’s a clickable button or not. The try again button is elevated and added a border so that the user can know that it is a button to refresh the page.

### Source paragraph 6674

Home

### Source paragraph 6680

Original screen                				       Version 1 				    	                 Version 2		                                    Final Version

### Source paragraph 6912

Version 1:

### Source paragraph 6924

Color was added to the Top App bar to highlight the heading. An introductory line was added to welcome the user to the home page as the app opens. Carousel dots were introduced under the banners to indicate horizontal swipe feature. Featured section was made vertically swipeable and number of cards were reduced to ease the user for swiping. Guitar courses, Keyboard courses, etc. were replaced with the root categories for the users to get wholesome view of all courses and reduce the visual complication.

### Source paragraph 7434

Version 2:

### Source paragraph 7445

To represent the brand in the app, Top App bar title ‘Home’ is replaced with the brand logo and name. The notifications can be accessed from the Top App bar which was first being accessed from the Bottom App Bar and another destination is added named ‘My Classes’ which includes the enrolled classes of the user which further eradicates the necessity of ‘My Enrollments’ section on Home page. The introductory line is removed as it consumes space unnecessarily and users will neglect the text once they become a regular user of the app. Another section named ‘Categories’ is added on the Home page to help users access the root category of courses of the app from one place present right on the first screen. The sub categories present in original screen were retained so as to depict more content on the Home screen which will be in favor of sales of the app.

### Source paragraph 8306

Final Version:

### Source paragraph 8321

In this version, another row has been added named ‘Trial Courses’ which consists of all the free courses for a new ussr to try which will increase the user engagement and further saleability of the app.

### Source paragraph 8526

Explore

### Source paragraph 8534

Original screen					                              Version 1						                         Final Version

### Source paragraph 8703

Version 1:

### Source paragraph 8714

This screen has the persistent search feature in an outlined rectangular container along with the microphone feature to ease the usage of the search bar by enabling just the usage of voice to search something. The text list present in the original screen can be helpful when there are a large number of items in the list. As there are only a few items, an image list is implemented which increases the tap area for the user and users don’t have to handle the burden of reading as images help to get the idea of a thing more quickly and efficiently as compared to text.

### Source paragraph 9284

Final Version:

### Source paragraph 9300

The voice feature in the previous version is removed and added to Extra Feature Suggestion List. The placeholder text ‘Search’ is removed as the presence of text makes the field less visible.

### Source paragraph 9492

My Classes

### Source paragraph 9503

Version 1                 					                      Version 2					                                 Final Version

### Source paragraph 9692

Version 1:

### Source paragraph 9703

This frame can be accessed from the Bottom Navigation Bar which enables the user to access the enrolled courses. ‘Recent’ section shows the first four courses or lessons which have been accessed by the user. ‘My Courses’ section shows the courses in which the user has enrolled. This section is added to the app so that the users can know where their courses will be and can access them from there.

### Source paragraph 10102

Version 2:

### Source paragraph 10113

List view in ‘My courses’ in version 1 has been removed as the image that will go in the given container will not be conveniently visible.

### Source paragraph 10252

Final Version:

### Source paragraph 10267

The ‘Recent’ section has been made to scroll horizontally to provide more space to the ‘My Courses’ section which is the main section of the screen. The courses section can be vertically scrolled so that the user has to remember less as the view scope is less in a horizontal scroll.

### Source paragraph 10554

Course Class

### Source paragraph 10568

Original screen                                                    Version 1                                                      Version 2 	                                                         Final Version

### Source paragraph 10813

Version 1:

### Source paragraph 10824

A blue line in the original screen is not the page loading progress bar but it is the course completion indicator. Due to this confusion, the space is added between the Top App bar and the course completion indicator. As for the navigation buttons, one has the text i.e., ‘Next’ and the other does not have the text. For maintaining the symmetry, both the buttons are given names here with proper application of colors.The comment icon is changed here as a thought of giving a new look to the design but it is again changed to the original one as it is the standard icon for ‘comments’ as per the Android Studio vector asset.

### Source paragraph 11451

Version 2:

### Source paragraph 11462

Text color for the number of comments is lightened and its font style has been changed from bold to regular as it has less significance than that of the ’Comment’ heading. The profile icon has been changed from ‘Filled’ to ‘Outlined’ to capture less attention of the user to that icon and focus more on the comments. The size of the profile icon for both comment and reply will be the same. The buttons for navigation have been made symmetrical and their position is according to the user’s thumb reachability. Meaningful text is applied in the buttons.

### Source paragraph 12016

Note: The vertical threaded commenting system can be applied to better segregate the comments and their replies. Also, the modal dialogue box that pops up when comment button is pressed can be changed and instead the comment box can be attached with the keyboard which can then be brought down by pressing back button instead of pressing ‘X’ in the case of modal dialog box. The font family of the comments has been changed to Neue Helvetica as in this font, cap-lines are lower than the default font which helps the text to look less congested (in line spacing part)

### Source paragraph 12584

Final Version:

### Source paragraph 12599

In this version, the course completion indicator has been removed as it still created confusion between it being a progress bar or the course completion indicator.

### Source paragraph 12777

As discussed about the modal dialog box in the SignUp and LogIn page, this concept is removed here too for the same reason. Instead, a comment box will pop up with the keyboard and it can be dismissed simply by pressing the back button.

### Source paragraph 13015

Course Overview

### Source paragraph 13031

Original screen                                                               Version 1							                Final Version

### Source paragraph 13232

Version 1:

### Source paragraph 13243

The share icon is removed from the Top App bar as it was removed from the Home page. This also gives benefit to lengthy titles of the course by giving more space in the App bar. The information about language and category, which were given in different cards, have been concatenated with other contents in the ‘Summary’ section. The gray background in the ‘Reviews’ section is removed and made white to go with the symmetry. Proper orientation of the text in the ‘Reviews’ section is done to better utilize the space. The color of the ‘Start’ button is changed to depict its significance.

### Source paragraph 13834

Final Version:

### Source paragraph 13849

The tab bar text has been changed from uppercase to sentence case to match the symmetry and to increase the legibility which gets reduced in the case of uppercase letters. The selected tab will have a focus on the respective text and others will have less saturation for a better legibility of the focused state. The changes have been made in the ‘Overview’ section only. The concept of cards has been removed and the whole background is made white instead. This has to be done as the card’s design created the unnecessary illusion of them being clickable which they weren’t. The only clickable card was the Review card which takes the user to another screen. The name ‘Summary’ has been changed to ‘This course includes’ to be more meaningful. The content in ‘Details’ section which gave the information about what all things will be learned at the end of the course are separated from that section and a dedicated section has been given named ’What you’ll learn’ to help user get to know the benefits of the course just by having a glance at this section. Again, ‘Details’ section name has been changed to ‘Description’ to be more meaningful and the sections ‘Category’ and ‘Language’ has been included in this section. Language and category will also be added in the sheet behind this tab sheet for the user. The review given by user will be aligned symetrically in the column and the time of review has been placed adjacent to the rating stars to better utilize the empty space. The color of the ‘Start’ button is retained to the original one to maintain the color theme symmetry.

### Source paragraph 15449

Information about the number of students and the language is added with the ratings and the category so that the user can get the necessary information quickly and can make the decision of enrolling in the course based on this information.

### Source paragraph 15691

Other Screens

### Source paragraph 15706

Original card

### Source paragraph 15818

Cards: The cards are redesigned and made expandable to add the feature of adding the course to the wish list. By pressing the down arrow, the card gets expanded and shows the rating of the course and an option to add the course to the wish list. The card will have a tick icon which will be visible when the course is completed. This will help the user to segregate which courses have been completed and which ones are left.

### Source paragraph 16244

Navigation Drawer

### Source paragraph 16262

Original screen 							Final Version

### Source paragraph 16437

Wish List: ‘Wish List’ is added here which will take the user to the Wish List page.

### Source paragraph 16522

FAQs: This added feature will take the user to the FAQs page.

### Source paragraph 16584

Invite Friends Icon: Icon to invite friends is changed from ‘share’ icon to better convey the ‘Invite Friends’ text.

### Source paragraph 16703

Profile background: A fancy background can be added instead of the plain background to improve the design.

### Source paragraph 16812

FAQs

### Source paragraph 16832

This page can be accessed from the Navigation Drawer from the Home page. This page is added to help users to access the frequently asked questions which are general about the app like “How do I select the course?” or “How are the courses structured?”. There is also a search button on the app bar to help users search for any specific question.

### Source paragraph 17179

Wish List

### Source paragraph 17189

New screen

### Source paragraph 17298

This page can be accessed from the Navigation Drawer. It contains all the courses which the user saves. For example, if the user is interested in a course but plans for buying it in future, then this feature can be useful. The user can add the desired course in the wish list with the help of heart button which can be seen on the course card by expanding it.

### Source paragraph 17660

Posts

### Source paragraph 17676

Original screen					                                 New screen

### Source paragraph 17918

New screen

### Source paragraph 17959

New screen

### Source paragraph 18002

In this page, the date and time have been separated by a dot for proper legibility and the space between the title and the entire row of date and time has been reduced to provide more emphasis on the caption added. The likes and comments row immediately below the video section has been converted to text only for the symmetry and its colour will not be changed. However, the section below them have some major changes. That row will only contain icons. Here, the like button can turn blue upon pressing it. Comment icon is changed as the former one seemed a little before time. Like, comment and share icon have been brought together on the left side to provide room for bookmark icon.

### Source paragraph 18690

Bookmark icon will help the user to save that particular post. Saved posts can be accessed from the bookmark icon on the app bar above which will take the user to a whole different page containing saved posts.

### Source paragraph 18903

Another change is possible where the student gets the feature of resuming the video in the default size rather than open it directly in a full screen. Imagine a situation where the student is searching far a scene which he has already seen somewhere but doesn’t remember the title and he has to go for the trial-and-error method of opening each video to and searching for the content. The student has to constantly move the phone in a vertical position to horizontal position every time a video resume. This will be exhausting to the user. A fast forwarding feature of 10-10 seconds will also be a helping hand for that purpose.

### Source paragraph 19532

Similarly, for an image, imagine a situation where the text font is too small to read. If the student is elderly and has a high-powered glasses, then that student will have a great difficulty to read. For that, zoom in and zoom out feature will be really helpful. Another option can be to open the image in full screen when taping the image.

### Source paragraph 19874

These changes are also applicable to the video sections provided in the courses.

### Source paragraph 19959

Profile

### Source paragraph 19967

Old screen                                         					New screen

### Source paragraph 20055

Here, the font of user name must be greater than the other details to lay emphasis on that this is user’s own section. Enrolments can be removed from here as a dedicated section has been provided for that purpose.

### Source paragraph 20270

To increase user engagement with the app, the app can be gamified to lure users into active and regular participation in attending courses. The students can earn Experience Points (XP) by completing the lessons in a course. They will receive a badge when the complete a full course. The numbers will increase with the progress under the gold coin and badge for Experience points and badges respectively.

### Source paragraph 20675

Under the gaming features, the current progress of the courses can be depicted with current XP of the course and the percentage of course completed according to the number of classes completed.

### Source paragraph 20869

In this way, the whole profile page will be dedicated to the student’s progress and motivation to study more and make it interesting with the help of gamification.

### Source paragraph 21037

Lessons Page

### Source paragraph 21050

Old screen 	              							New screen

### Source paragraph 21110

In the content tab of any course, a clickable text ‘Go to main course’ can be provided under the ‘Finish course/ Course completed’ text. This added clickable text will help the user to navigate in the vertical level of hierarchy of the course, i.e., the student will be able to go to the parent collection of the course from where he currently is. There can be a situation where the lessons inside a collection course have connections between them. Imagine that a user is in lesson number 3 and he wants to recall the concept of lesson 2. In this case, he has to all the way back to the screen where there is recent classes section (unless he accessed that lesson from the parent course) and will have to go to the main course to find lesson 2. This can break the link of the study. To avoid this, this feature of navigating directly to the parent course will be useful.

### Source paragraph 22121

In the dashboard tab, the list given below the progress summary is entirely clickable but leads to the same page with the same content and so does the ‘View detailed report’ text. This can confuse a new user sometimes. This can be avoided by removing the clickables from the list and leaving only the text ‘View detailed report’ clickable.

### Source paragraph 22462

Old screen                                                 					    New screen

### Source paragraph 22604

In the detailed report, the same list which is displayed (videos, reads, etc) is removed and ‘Course Report’ title has been brought down from the app bar to the main screen to avoid congested text. The ticks which were black in purple circle have been replaced with normal purple ticks as the former ones weren’t visible enough.

### Source paragraph 22933

Also, another clickable text ‘Main course FAQs’ can be added below to take the user to Main course FAQs page.

### Source paragraph 23045

Course FAQs

### Source paragraph 23063

New screen

### Source paragraph 23097

This page will contain all the frequently asked questions of that particular course collection. Students can ask the questions under the comment section of the class or on the personal WhatsApp and this is happening indeed. But some students may get scared to initiate and ask question publicly or even personally thinking the question to be naïve. Such students search for the answers if the question has already been asked and finding a separate section for the already asked questions will be really helpful.

### Source paragraph 23610

If the questions are asked and answered in comment section and someone wants to read it, the student has to scroll through other comments to search for the required answer. What if the student doesn’t remember the exact class in which that little concept was taught and which the title doesn’t give the hint of ? The student has to go through the comment sections of various classes or has to personally WhatsApp the teacher. Answering the same question repeatedly can be exhausting for anyone.

### Source paragraph 24106

To avoid these circumstances, a separate section of FAQs can be provided with questions related to whole collection of the course. Here, the student can also search for a specific question through the search button.

### Source paragraph 24329

Course complete/ Finish course screen

### Source paragraph 24367

Old screen 	                                                               			New screen

### Source paragraph 24516

From Course Completed screen, the WhatsApp icon is removed to get more space. It is present in other sections so removing it from this page will not affect the conveniency. The double tick icon is replaced with XP icon to depict that the student has achieved something. ‘Mark as incomplete’ is rearranged to be at the bottom at the screen as someone who has made the efforts to complete the course will not like something that leads to all the efforts getting undone near the victory. To showcase that user is ready to begin next session, the next session text will become black from grey and container will become green. The quantitative colour changes are done to keep the page in decent colour combinations.

### Source paragraph 25228

Old screen	                                                              			New screen

### Source paragraph 25376

Similar concept has been used in Finish Course screen where ‘Mark as completed’ button will be big as it leads the student towards the victory.

### Source paragraph 25613

A splash screen will be displayed after pressing the ‘Mark as completed’ button to show the XP gained.

