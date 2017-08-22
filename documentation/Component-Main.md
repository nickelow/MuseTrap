## Classes

<dl>
<dt><a href="#Main">Main</a></dt>
<dd><p>Main component behavior
States:
Sequence object to describe the song</p>
</dd>
<dt><a href="#Routes">Routes</a></dt>
<dd></dd>
</dl>

<a name="Main"></a>

## Main
Main component behaviorStates:Sequence object to describe the song

**Kind**: global class  

* [Main](#Main)
    * [.addSampleToBoard(indexOfSampleClicked)](#Main+addSampleToBoard)
    * [.removeSampleFromBoard(indexOfSampleClicked)](#Main+removeSampleFromBoard)
    * [.playSampleFromLibrary(indexOfSampleClicked)](#Main+playSampleFromLibrary)
    * [.toggleSoundOnBoard()](#Main+toggleSoundOnBoard)
    * [.loginCB(username, password)](#Main+loginCB)
    * [.createAcctCB(username, password)](#Main+createAcctCB)
    * [.logoutCB()](#Main+logoutCB)
    * [.getUserName()](#Main+getUserName)
    * [.getSavedSequences()](#Main+getSavedSequences)
    * [.loadSavedSequence()](#Main+loadSavedSequence)
    * [.loadSharedSequence()](#Main+loadSharedSequence)
    * [.saveSequence()](#Main+saveSequence)
    * [.playClicked()](#Main+playClicked)
    * [.stopClicked()](#Main+stopClicked)
    * [.loopClicked()](#Main+loopClicked)
    * [.saveClicked()](#Main+saveClicked)
    * [.shareClicked()](#Main+shareClicked)
    * [.playSequence()](#Main+playSequence)
    * [.changeBPM()](#Main+changeBPM)

<a name="Main+addSampleToBoard"></a>

### main.addSampleToBoard(indexOfSampleClicked)
When you doubleClick on a sample in the sampleLibrary, this function updates the sequence state adding it to the SoundBoard

**Kind**: instance method of [<code>Main</code>](#Main)  

| Param | Type |
| --- | --- |
| indexOfSampleClicked | <code>number</code> | 

<a name="Main+removeSampleFromBoard"></a>

### main.removeSampleFromBoard(indexOfSampleClicked)
When you click on the X next to a sample name in the soundboard, this function removes the sample from the sequence and soundboard

**Kind**: instance method of [<code>Main</code>](#Main)  

| Param | Type |
| --- | --- |
| indexOfSampleClicked | <code>number</code> | 

<a name="Main+playSampleFromLibrary"></a>

### main.playSampleFromLibrary(indexOfSampleClicked)
Triggers when you click on a sample in the sampleLibrary.

**Kind**: instance method of [<code>Main</code>](#Main)  

| Param | Type |
| --- | --- |
| indexOfSampleClicked | <code>number</code> | 

<a name="Main+toggleSoundOnBoard"></a>

### main.toggleSoundOnBoard()
Click Handler for soundboard. Toggles sound for each 1/8th duration.

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+loginCB"></a>

### main.loginCB(username, password)
Login to the app

**Kind**: instance method of [<code>Main</code>](#Main)  

| Param | Type |
| --- | --- |
| username | <code>string</code> | 
| password | <code>string</code> | 

<a name="Main+createAcctCB"></a>

### main.createAcctCB(username, password)
Create new account for the app

**Kind**: instance method of [<code>Main</code>](#Main)  

| Param | Type |
| --- | --- |
| username | <code>string</code> | 
| password | <code>string</code> | 

<a name="Main+logoutCB"></a>

### main.logoutCB()
Logout of the app

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+getUserName"></a>

### main.getUserName()
Get username of person logged in, and also the usernames saved sequences

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+getSavedSequences"></a>

### main.getSavedSequences()
Get the usernames saved sequences

**Kind**: instance method of [<code>Main</code>](#Main)  
**Params**: username  
<a name="Main+loadSavedSequence"></a>

### main.loadSavedSequence()
Load retrieved sequence to the page

**Kind**: instance method of [<code>Main</code>](#Main)  
**Params**: index  
<a name="Main+loadSharedSequence"></a>

### main.loadSharedSequence()
load shared song if this is a shareable linkusers/:username/:sequenceObjID

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+saveSequence"></a>

### main.saveSequence()
Save current sequence on the pageto look like this in the database{ user: 'MyUserName', sequenceRows:   [     {beat: 'blah', row: [0, 0, 0, 0, 0, 0, 0, 0]},     {beat: 'blah2', row: [0, 0, 0, 0, 0, 0, 0, 0]},     {beat: 'blah3', row: [0, 0, 0, 0, 0, 0, 0, 0]},     {beat: 'blah4', row: [0, 0, 0, 0, 0, 0, 0, 0]}   ]}

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+playClicked"></a>

### main.playClicked()
Clicking the play button will toggle between play and pause
  change play visualizer to visible+moving if was stopped
   change play visualizer to moving if was paused
  Run Main callback to "play"
  play sounds starting from time 0 OR last pause (Assume that Main component keeps track of last time)

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+stopClicked"></a>

### main.stopClicked()
Clicking the stop button will stops the sound
    change the play button image to triangle button
    change play visualizer to invisible and not moving
    Leave loop button alone

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+loopClicked"></a>

### main.loopClicked()
Clicking the loop button will toggle between on or off (CURRENTLY NOT WORKING)
    Run Main callback to toggle looping

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+saveClicked"></a>

### main.saveClicked()
When the save button is clicked
    Run Main callback to "save"

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+shareClicked"></a>

### main.shareClicked()
When the share button is clicked
    Run Main callback to "share"

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+playSequence"></a>

### main.playSequence()
Plays current sequence. If loop is true, then play with interval.

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Main+changeBPM"></a>

### main.changeBPM()
changes bpm of the sequence. takes number between 60-999

**Kind**: instance method of [<code>Main</code>](#Main)  
<a name="Routes"></a>

## Routes
**Kind**: global class  
<a name="new_Routes_new"></a>

### new Routes()
Routes is setup so that Main component is able to render slightly differently for these 3 situations Not logged in at root /; demo mode only Logged in to /member; can save and share sequences   If loggedIn===true, Main component should render extra things such as User's saved seqeunces in a list   on the righthand side   Also, the top navbar should change to a "logout" button Sharing /users/:username/:sequenceObjID; same as demo mode but with shared sequence loaded on the player

