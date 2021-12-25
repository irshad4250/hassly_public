# hassly_public
E-commerce website with a powerful search engine equipped with autocomplete

hassly in an e-commerce website like all the others but the difference is that it contains a tailor made search engine specifically designed for e-commerce
The website includes autocomplete, search relevancy, will return you the results you wanted even if there are errors(such as typos) in your search.
In order for that search magic to happen mongodb atlas search is being used.

The search engine even includes a filter option.
You can include a maximum price, maximum shipping price and even search by category which refines the search results (for categories) better than using the normal one(for categories ofc)

For all this happen 3 search indexes are used (do not mind the names they really do not covey the real use -- naming is hard) 
1. hasslyNoFilterSearch => For the home normal search
2. hasslyAutoComplete => For autocomplete feature
3. forHomeShowing => For searching by categories

Let's dive deep into how hassly works

First things first the home page 
Simple but beautiful UI design

![Screenshot (2)](https://user-images.githubusercontent.com/93472888/147377044-cf84b2cd-f89b-48bd-8750-b2f333c62961.png)

The home page contains latest items, categories etc...
To get items for the categories section, the forHomeShowing search index is used

![Screenshot (4)](https://user-images.githubusercontent.com/93472888/147377102-d01aae7d-1c84-42f0-b22a-ef16c31eaf37.png)


Next thing the search bar and the filter box
![Screenshot (6)](https://user-images.githubusercontent.com/93472888/147377141-70dc6c45-b167-42bf-a55e-c84d05e548cd.png)

You can enter your filters and if you want to search by category, click search by category, and use the search bar to type category

Now search demo,
lets search for 'playstation',
You will see autocomplete show up

![Screenshot (8)](https://user-images.githubusercontent.com/93472888/147377182-51926d05-b850-46a2-a485-ade50ec71f1a.png)

The search results:
![Screenshot (10)](https://user-images.githubusercontent.com/93472888/147377205-31a88127-971c-4f8f-9ea4-e0a55950d586.png)


Now let's test the search engine by making an error
You will see autocomplete does not show up
![Screenshot (12)](https://user-images.githubusercontent.com/93472888/147377235-8fd45007-1c04-4971-86d8-93cf06a6caef.png)

BUT the results are the same
![Screenshot (14)](https://user-images.githubusercontent.com/93472888/147377245-3d14608d-7069-462c-8f77-5d9f521d6b0c.png)

search index for the normal search
It searches through the brand title description and tags(categories) 
Which gives relevant search result even if the title does not contain any of your words entered

![Screenshot (18)](https://user-images.githubusercontent.com/93472888/147377361-6035b29e-29b6-4110-9d5e-34d296850f8b.png)

But without the backend configuration the search result would not be as good
Using max edits 2 to correct errors
using prefix length for the index to not completely modify you search
![Screenshot (16)](https://user-images.githubusercontent.com/93472888/147377309-b220265c-8c8b-4a84-97f2-cbc7da956279.png)


----------------------------------------------------------------------------
 
Autocomplete index 
![Screenshot (20)](https://user-images.githubusercontent.com/93472888/147377351-e92a37b6-9e3b-4955-9316-617c4885b522.png)
![Screenshot (22)](https://user-images.githubusercontent.com/93472888/147377458-2c538898-fb11-4f68-ae2d-32985cf0862c.png)


The autocomplete fuzzy contains a prefix length of 18,
so as to suggest completion result based only on your word
without prefixLength mongodb would change the word and give you irrelevant autocomplete result

for example: text in search box 'ches'
in this case you are searching for chess
  
without prefix length:
autocomplete would show you 'chef' and 'chess'

with prefixlength
autocomplete only shows you 'chess'
PLEASE NOTE THAT AUTOCOMPLETE WILL NOT AFFECT SEARCH RESULT

How filter works
---------------------------------------------
So basically it makes use of the $match operator,
if a filter option is chosen a function will insert a $match JSON into the pipeline/aggregate whatever it's called,
See line 245 in index.js


Adding item
---------------------------------
Use the add item from the navbar
Please note that you need to input image url because we do not have a storage lol

Additional notes
----------------------
the website demo is 
hassly.herokuapp.com

The website currently contains only 33 items which will change when people add items
you can use the products.txt which contains items informations to test the website


