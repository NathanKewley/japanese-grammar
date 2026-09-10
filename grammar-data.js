const N5_GRAMMAR = [
  {
    id:"n5-desu",level:"N5",pattern:"です",title:'Polite "to be"',short:"Polite statements about what something is or is like.",
    explanation:"です is used to say that something is something else, or to describe what something is, in a polite way. It is commonly used after nouns and な-adjectives.",
    usages:[
      {title:"Identifying something",examples:[
        {japanese:"私は学生です。",furigana:"わたしはがくせいです。",english:"I am a student."},
        {japanese:"これは本です。",furigana:"これはほんです。",english:"This is a book."}]},
      {title:"Describing something",examples:[
        {japanese:"この町は静かです。",furigana:"このまちはしずかです。",english:"This town is quiet."}]},
      {title:"Asking a question",examples:[
        {japanese:"田中さんは先生ですか。",furigana:"たなかさんはせんせいですか。",english:"Is Tanaka a teacher?"}]}
    ],notes:"This entry includes closely related polite forms such as ではありません and でした."
  },
  {
    id:"n5-masu",level:"N5",pattern:"～ます",title:"Polite verb form",short:"A common polite way to use Japanese verbs.",
    explanation:"～ます is used to make verbs polite and is one of the most common verb forms for beginners. It can describe something that happens regularly or something that will happen.",
    usages:[
      {title:"Present or habitual action",examples:[{japanese:"毎日、日本語を勉強します。",furigana:"まいにち、にほんごをべんきょうします。",english:"I study Japanese every day."}]},
      {title:"Future action",examples:[{japanese:"明日、東京へ行きます。",furigana:"あした、とうきょうへいきます。",english:"I will go to Tokyo tomorrow."}]},
      {title:"Other polite forms",examples:[
        {japanese:"何を食べますか。",furigana:"なにをたべますか。",english:"What will you eat?"},
        {japanese:"コーヒーを飲みません。",furigana:"コーヒーをのみません。",english:"I don't drink coffee."},
        {japanese:"昨日、映画を見ました。",furigana:"きのう、えいがをみました。",english:"I watched a movie yesterday."}]}
    ],notes:"The ～ます family includes ～ません, ～ました, and ～ませんでした."
  },
  {
    id:"n5-wa",level:"N5",pattern:"は",title:"Topic marker",short:"Shows what the sentence is mainly about.",
    explanation:"は marks what the sentence is mainly about. It is often similar to saying “as for...” in English, although a natural English translation usually does not include those words.",
    usages:[
      {title:"Introducing a topic",examples:[{japanese:"私は学生です。",furigana:"わたしはがくせいです。",english:"I am a student."}]},
      {title:"Talking about something",examples:[{japanese:"この本は面白いです。",furigana:"このほんはおもしろいです。",english:"This book is interesting."}]},
      {title:"Contrast",examples:[
        {japanese:"私はコーヒーが好きです。",furigana:"わたしはコーヒーがすきです。",english:"I like coffee."},
        {japanese:"弟はコーヒーが好きではありません。",furigana:"おとうとはコーヒーがすきではありません。",english:"My younger brother does not like coffee."}]}
    ],notes:"は is pronounced “wa” when used as the topic particle."
  },
  {
    id:"n5-ga",level:"N5",pattern:"が",title:"Subject / focus marker",short:"Marks the subject or puts focus on who or what.",
    explanation:"が marks the subject of a sentence and can put emphasis on who or what performs an action or has a particular quality. It is also commonly used when introducing something new or answering a question about who or what.",
    usages:[
      {title:"Introducing something",examples:[{japanese:"猫がいます。",furigana:"ねこがいます。",english:"There is a cat."}]},
      {title:"Answering “who?”",examples:[
        {japanese:"誰が来ましたか。",furigana:"だれがきましたか。",english:"Who came?"},
        {japanese:"田中さんが来ました。",furigana:"たなかさんがきました。",english:"Tanaka came."}]},
      {title:"With a description",examples:[{japanese:"この料理が美味しいです。",furigana:"このりょうりがおいしいです。",english:"This dish is delicious."}]}
    ],notes:"The difference between は and が is context-dependent; they should not be learned as completely interchangeable “subject particles.”"
  },
  {
    id:"n5-o",level:"N5",pattern:"を",title:"Object marker",short:"Marks the thing that a verb acts on.",
    explanation:"を marks the thing that a verb acts on. It is normally pronounced お (o) rather than “wo” in modern Japanese.",
    usages:[
      {title:"Common actions",examples:[
        {japanese:"ご飯を食べます。",furigana:"ごはんをたべます。",english:"I eat rice."},
        {japanese:"水を飲みます。",furigana:"みずをのみます。",english:"I drink water."},
        {japanese:"本を読みます。",furigana:"ほんをよみます。",english:"I read a book."}]}
    ]
  },
  {
    id:"n5-ni",level:"N5",pattern:"に",title:"Time, destination & target",short:"Marks several relationships, including time, destination and target.",
    explanation:"に marks several different relationships, including a specific time, a destination, or the target of an action. Its meaning depends on the type of sentence it appears in.",
    usages:[
      {title:"Specific time",examples:[{japanese:"7時に起きます。",furigana:"しちじにおきます。",english:"I wake up at 7 o'clock."}]},
      {title:"Destination",examples:[{japanese:"日本に行きます。",furigana:"にほんにいきます。",english:"I go to Japan."}]},
      {title:"Where something exists",examples:[{japanese:"机の上に本があります。",furigana:"つくえのうえにほんがあります。",english:"There is a book on the desk."}]},
      {title:"Target or recipient",examples:[{japanese:"先生に聞きます。",furigana:"せんせいにききます。",english:"I ask the teacher."}]}
    ],notes:"Common time words such as 今日, 明日 and 毎日 usually do not take に."
  },
  {
    id:"n5-de",level:"N5",pattern:"で",title:"Location of action / means",short:"Marks where an action happens or what is used to do it.",
    explanation:"で marks where an action happens or what is used to perform an action. It is different from に when talking about locations: に often marks where something exists, while で marks where an action takes place.",
    usages:[
      {title:"Location of an action",examples:[
        {japanese:"学校で勉強します。",furigana:"がっこうでべんきょうします。",english:"I study at school."},
        {japanese:"レストランで昼ご飯を食べました。",furigana:"レストランでひるごはんをたべました。",english:"I ate lunch at a restaurant."}]},
      {title:"Means or tool",examples:[
        {japanese:"電車で行きます。",furigana:"でんしゃでいきます。",english:"I go by train."},
        {japanese:"箸で食べます。",furigana:"はしでたべます。",english:"I eat with chopsticks."}]}
    ]
  },
  {
    id:"n5-no",level:"N5",pattern:"の",title:"Possession / relationship",short:"Connects nouns to show possession or another relationship.",
    explanation:"の connects two nouns and shows a relationship between them, often possession or belonging. It is commonly translated as “of” or “’s”, but its use is broader than English possession.",
    usages:[
      {title:"Possession",examples:[{japanese:"私の本です。",furigana:"わたしのほんです。",english:"It is my book."}]},
      {title:"Relationship or type",examples:[
        {japanese:"日本語の先生です。",furigana:"にほんごのせんせいです。",english:"They are a Japanese teacher."},
        {japanese:"日本の車です。",furigana:"にほんのくるまです。",english:"It is a Japanese car."}]},
      {title:"Asking “whose?”",examples:[{japanese:"これは誰のかばんですか。",furigana:"これはだれのかばんですか。",english:"Whose bag is this?"}]}
    ]
  },
  {
    id:"n5-tai",level:"N5",pattern:"～たい",title:"Want to do something",short:"Expresses a desire to perform an action.",
    explanation:"～たい expresses a desire to do something and is attached to the verb stem. It is mainly used to talk about the speaker’s own wishes, or someone else’s wishes when those wishes are known.",
    usages:[
      {title:"Personal desire",examples:[
        {japanese:"日本に行きたいです。",furigana:"にほんにいきたいです。",english:"I want to go to Japan."},
        {japanese:"ラーメンを食べたいです。",furigana:"ラーメンをたべたいです。",english:"I want to eat ramen."}]},
      {title:"Negative desire",examples:[{japanese:"今日は出かけたくないです。",furigana:"きょうはでかけたくないです。",english:"I do not want to go out today."}]},
      {title:"Past desire",examples:[{japanese:"昨日は早く寝たかったです。",furigana:"きのうははやくねたかったです。",english:"I wanted to go to bed early yesterday."}]}
    ],notes:"～たい behaves like an い-adjective: たい → たくない → たかった → たくなかった."
  },
  {
    id:"n5-teiru",level:"N5",pattern:"～ている",title:"Ongoing action / continuing state",short:"Can describe an action happening now or a state that continues.",
    explanation:"～ている can describe an action that is happening now, or a state that continues after something happened. The exact meaning depends on the verb and context.",
    usages:[
      {title:"Action happening now",examples:[
        {japanese:"今、本を読んでいます。",furigana:"いま、ほんをよんでいます。",english:"I am reading a book now."},
        {japanese:"雨が降っています。",furigana:"あめがふっています。",english:"It is raining."}]},
      {title:"Continuing state",examples:[{japanese:"東京に住んでいます。",furigana:"とうきょうにすんでいます。",english:"I live in Tokyo."}]},
      {title:"Resulting state",examples:[{japanese:"ドアが開いています。",furigana:"ドアがあいています。",english:"The door is open."}]}
    ],notes:"The same ～ている form can express different ideas depending on the verb, so context matters."
  },

  {
    id:"n5-ka",level:"N5",pattern:"か",title:"Question marker",short:"Turns a statement into a polite question.",
    explanation:"か is placed at the end of a sentence to mark a question in polite Japanese. It can also appear inside a sentence to mean “whether” or “or” in some patterns.",
    usages:[
      {title:"Yes / no question",examples:[{japanese:"学生ですか。",furigana:"がくせいですか。",english:"Are you a student?"}]},
      {title:"Question word",examples:[{japanese:"何を食べますか。",furigana:"なにをたべますか。",english:"What will you eat?"}]}
    ]
  },
  {
    id:"n5-mo",level:"N5",pattern:"も",title:"Also / too",short:"Adds the meaning “also”, “too”, or “as well”.",
    explanation:"も replaces a particle such as は or が when you want to say that something is also true. It can also emphasize a surprisingly large or small amount in other patterns.",
    usages:[
      {title:"Also / too",examples:[
        {japanese:"私も学生です。",furigana:"わたしもがくせいです。",english:"I am also a student."},
        {japanese:"田中さんも来ました。",furigana:"たなかさんもきました。",english:"Tanaka came too."}]}
    ]
  },
  {
    id:"n5-e",level:"N5",pattern:"へ",title:"Direction / destination",short:"Shows the direction or destination of movement.",
    explanation:"へ marks the direction or destination of movement. It is similar to に for destinations, but puts more emphasis on the direction of travel.",
    usages:[
      {title:"Going somewhere",examples:[
        {japanese:"日本へ行きます。",furigana:"にほんへいきます。",english:"I am going to Japan."},
        {japanese:"家へ帰ります。",furigana:"いえへかえります。",english:"I am going home."}]}
    ],notes:"The particle へ is pronounced “e”."
  },
  {
    id:"n5-to",level:"N5",pattern:"と",title:"And / with",short:"Connects nouns or marks someone you do something with.",
    explanation:"と connects nouns when listing complete items, and it can mark the person you do an action with. It has several other uses at higher levels.",
    usages:[
      {title:"And",examples:[{japanese:"りんごとバナナを買いました。",furigana:"りんごとバナナをかいました。",english:"I bought apples and bananas."}]},
      {title:"With someone",examples:[{japanese:"友達と映画を見ます。",furigana:"ともだちとえいがをみます。",english:"I watch a movie with a friend."}]}
    ]
  },
  {
    id:"n5-ya",level:"N5",pattern:"や",title:"And, among other things",short:"Lists examples without saying the list is complete.",
    explanation:"や connects nouns to give examples from a larger group. It is useful when you mean “A, B, and things like that.”",
    usages:[
      {title:"Giving examples",examples:[
        {japanese:"りんごやバナナを買いました。",furigana:"りんごやバナナをかいました。",english:"I bought apples, bananas, and things like that."}]}
    ]
  },
  {
    id:"n5-ne",level:"N5",pattern:"ね",title:"Seeking agreement",short:"Adds a feeling like “right?”, “isn't it?”, or “you know”.",
    explanation:"ね is used when the speaker expects the listener to agree, notice the same thing, or share the feeling. It can make a statement sound friendlier and more conversational.",
    usages:[
      {title:"Seeking agreement",examples:[
        {japanese:"今日は暑いですね。",furigana:"きょうはあついですね。",english:"It's hot today, isn't it?"},
        {japanese:"きれいですね。",furigana:"きれいですね。",english:"It's beautiful, isn't it?"}]}
    ]
  },
  {
    id:"n5-yo",level:"N5",pattern:"よ",title:"Adding emphasis",short:"Emphasizes information or tells the listener something they may not know.",
    explanation:"よ adds emphasis and can signal that the speaker is giving the listener useful or new information. It is common in friendly spoken Japanese.",
    usages:[
      {title:"Giving information",examples:[
        {japanese:"これは美味しいですよ。",furigana:"これはおいしいですよ。",english:"This is delicious, you know."},
        {japanese:"明日は休みですよ。",furigana:"あしたはやすみですよ。",english:"Tomorrow is a day off, you know."}]}
    ]
  },
  {
    id:"n5-aru",level:"N5",pattern:"あります",title:"There is / exists (things)",short:"Says that a non-living thing exists or is located somewhere.",
    explanation:"あります is used for the existence or location of non-living things such as objects, plants, and places. The thing that exists is normally marked with が.",
    usages:[
      {title:"Something exists",examples:[{japanese:"机があります。",furigana:"つくえがあります。",english:"There is a desk."}]},
      {title:"Something is somewhere",examples:[{japanese:"部屋にテレビがあります。",furigana:"へやにテレビがあります。",english:"There is a TV in the room."}]}
    ]
  },
  {
    id:"n5-iru",level:"N5",pattern:"います",title:"There is / exists (living things)",short:"Says that a person or animal exists or is somewhere.",
    explanation:"います is used for the existence or location of people and animals. The person or animal that exists is normally marked with が.",
    usages:[
      {title:"Someone or something living exists",examples:[
        {japanese:"猫がいます。",furigana:"ねこがいます。",english:"There is a cat."},
        {japanese:"先生がいます。",furigana:"せんせいがいます。",english:"The teacher is here."}]}
    ]
  },
  {
    id:"n5-janai",level:"N5",pattern:"じゃない / ではない",title:"Not / is not",short:"Makes a noun or な-adjective statement negative.",
    explanation:"じゃない and ではない mean “is not” or “are not” after nouns and な-adjectives. じゃない is more conversational, while ではない is more formal or written.",
    usages:[
      {title:"Negative statement",examples:[
        {japanese:"学生じゃないです。",furigana:"がくせいじゃないです。",english:"I am not a student."},
        {japanese:"これは私の本ではありません。",furigana:"これはわたしのほんではありません。",english:"This is not my book."}]}
    ]
  },
  {
    id:"n5-i-adj",level:"N5",pattern:"い-adjectives",title:"Describing with い-adjectives",short:"Adjectives ending in い that can directly describe nouns and change form.",
    explanation:"い-adjectives can directly come before nouns and can change their endings to make negative or past forms. They are one of the two main adjective groups in Japanese.",
    usages:[
      {title:"Before a noun",examples:[{japanese:"大きい犬です。",furigana:"おおきいいぬです。",english:"It is a big dog."}]},
      {title:"Negative",examples:[{japanese:"今日は寒くないです。",furigana:"きょうはさむくないです。",english:"It is not cold today."}]},
      {title:"Past",examples:[{japanese:"昨日は暑かったです。",furigana:"きのうはあつかったです。",english:"It was hot yesterday."}]}
    ],notes:"Not every adjective ending in い is an い-adjective; common exceptions such as きれい belong to the な-adjective group."
  },
  {
    id:"n5-na-adj",level:"N5",pattern:"な-adjectives",title:"Describing with な-adjectives",short:"Adjectives that use な before a noun and です in polite statements.",
    explanation:"な-adjectives use な when they directly modify a noun. They behave more like nouns when forming polite negative and past sentences.",
    usages:[
      {title:"Before a noun",examples:[{japanese:"静かな町です。",furigana:"しずかなまちです。",english:"It is a quiet town."}]},
      {title:"Polite description",examples:[{japanese:"この町は静かです。",furigana:"このまちはしずかです。",english:"This town is quiet."}]},
      {title:"Negative",examples:[{japanese:"便利ではありません。",furigana:"べんりではありません。",english:"It is not convenient."}]}
    ]
  },
  {
    id:"n5-kono",level:"N5",pattern:"この / その / あの",title:"This / that / that over there",short:"Points to a noun based on its distance from the speaker and listener.",
    explanation:"この, その, and あの come directly before nouns to mean “this”, “that”, and “that over there”. The choice depends on where the thing is relative to the people speaking.",
    usages:[
      {title:"Near the speaker",examples:[{japanese:"この本は面白いです。",furigana:"このほんはおもしろいです。",english:"This book is interesting."}]},
      {title:"Near the listener",examples:[{japanese:"そのかばんはあなたのですか。",furigana:"そのかばんはあなたのですか。",english:"Is that bag yours?"}]},
      {title:"Far from both",examples:[{japanese:"あの山は高いです。",furigana:"あのやまはたかいです。",english:"That mountain over there is tall."}]}
    ]
  },
  {
    id:"n5-kore",level:"N5",pattern:"これ / それ / あれ",title:"This / that / that over there",short:"Pronouns used to point to things.",
    explanation:"これ, それ, and あれ stand alone as nouns and mean “this”, “that”, and “that over there”. They follow the same distance pattern as この, その, and あの.",
    usages:[
      {title:"Asking what something is",examples:[{japanese:"これは何ですか。",furigana:"これはなんですか。",english:"What is this?"}]},
      {title:"Answering",examples:[{japanese:"それはペンです。",furigana:"それはペンです。",english:"That is a pen."}]}
    ]
  },
  {
    id:"n5-dare",level:"N5",pattern:"誰 / だれ",title:"Who",short:"Asks which person or people.",
    explanation:"誰 asks “who?” and is used when identifying a person. The polite form 誰ですか is common in basic questions.",
    usages:[
      {title:"Asking who someone is",examples:[
        {japanese:"あの人は誰ですか。",furigana:"あのひとはだれですか。",english:"Who is that person?"},
        {japanese:"誰が来ましたか。",furigana:"だれがきましたか。",english:"Who came?"}]}
    ]
  },
  {
    id:"n5-nani",level:"N5",pattern:"何 / なに・なん",title:"What",short:"Asks about a thing or information.",
    explanation:"何 asks “what?” and can be read なに or なん depending on the word that follows. It is one of the most common Japanese question words.",
    usages:[
      {title:"Asking what something is",examples:[{japanese:"これは何ですか。",furigana:"これはなんですか。",english:"What is this?"}]},
      {title:"Asking what someone does",examples:[{japanese:"何を食べますか。",furigana:"なにをたべますか。",english:"What will you eat?"}]}
    ]
  },
  {
    id:"n5-doko",level:"N5",pattern:"どこ",title:"Where",short:"Asks about a place or location.",
    explanation:"どこ asks “where?” and is used to ask about places or locations. It can be used with に, で, or other particles depending on the sentence.",
    usages:[
      {title:"Location",examples:[{japanese:"トイレはどこですか。",furigana:"トイレはどこですか。",english:"Where is the bathroom?"}]},
      {title:"Destination",examples:[{japanese:"どこに行きますか。",furigana:"どこにいきますか。",english:"Where are you going?"}]}
    ]
  },
  {
    id:"n5-doushite",level:"N5",pattern:"どうして",title:"Why",short:"Asks for a reason.",
    explanation:"どうして asks why something happens or why someone does something. It is often followed by an answer using から.",
    usages:[
      {title:"Asking for a reason",examples:[{japanese:"どうして日本語を勉強しますか。",furigana:"どうしてにほんごをべんきょうしますか。",english:"Why do you study Japanese?"}]}
    ]
  },
  {
    id:"n5-dou",level:"N5",pattern:"どう",title:"How / what do you think?",short:"Asks about a way, condition, or opinion.",
    explanation:"どう asks how something is, how something should be done, or what someone thinks about something. The exact English wording depends on the context.",
    usages:[
      {title:"Asking how something is",examples:[{japanese:"日本の生活はどうですか。",furigana:"にほんのせいかつはどうですか。",english:"How is life in Japan?"}]},
      {title:"Asking for an opinion",examples:[{japanese:"この映画はどうですか。",furigana:"このえいがはどうですか。",english:"What do you think of this movie?"}]}
    ]
  },
  {
    id:"n5-douyatte",level:"N5",pattern:"どうやって",title:"How / by what method",short:"Asks how to do something or how something is done.",
    explanation:"どうやって asks about the method or way of doing something. It is often followed by a verb.",
    usages:[
      {title:"Asking how to get somewhere",examples:[{japanese:"駅へどうやって行きますか。",furigana:"えきへどうやっていきますか。",english:"How do you get to the station?"}]}
    ]
  },
  {
    id:"n5-itsumo",level:"N5",pattern:"いつも",title:"Always / usually",short:"Describes something that happens regularly or habitually.",
    explanation:"いつも means “always” or “usually” and describes a repeated habit or regular situation. Its exact English translation depends on how often the action happens.",
    usages:[
      {title:"Habit",examples:[
        {japanese:"いつも朝ご飯を食べます。",furigana:"いつもあさごはんをたべます。",english:"I always eat breakfast."},
        {japanese:"彼はいつも忙しいです。",furigana:"かれはいつもいそがしいです。",english:"He is always busy."}]}
    ]
  },
  {
    id:"n5-mou",level:"N5",pattern:"もう",title:"Already / no longer",short:"Often means “already” or “anymore” depending on the sentence.",
    explanation:"もう can show that something has already happened or that a previous state is no longer true. The negative form often gives the meaning “not anymore”.",
    usages:[
      {title:"Already",examples:[{japanese:"もう食べました。",furigana:"もうたべました。",english:"I already ate."}]},
      {title:"No longer",examples:[{japanese:"もうありません。",furigana:"もうありません。",english:"There isn't any more."}]}
    ]
  },
  {
    id:"n5-mada",level:"N5",pattern:"まだ",title:"Still / not yet",short:"Shows that something continues or has not happened yet.",
    explanation:"まだ can mean “still” when a situation continues, or “not yet” when used with a negative verb. It is commonly paired with まだ～ていません for “have not yet done”.",
    usages:[
      {title:"Still",examples:[{japanese:"まだ学生です。",furigana:"まだがくせいです。",english:"I am still a student."}]},
      {title:"Not yet",examples:[{japanese:"まだ食べていません。",furigana:"まだたべていません。",english:"I have not eaten yet."}]}
    ]
  },
  {
    id:"n5-kara",level:"N5",pattern:"から",title:"From / because",short:"Can mark a starting point or give a reason.",
    explanation:"から can mean “from” when marking a starting point, or “because” when giving a reason. The meaning is clear from what surrounds it.",
    usages:[
      {title:"Starting point",examples:[{japanese:"9時から働きます。",furigana:"くじからはたらきます。",english:"I work from 9 o'clock."}]},
      {title:"Because",examples:[{japanese:"雨ですから、行きません。",furigana:"あめですから、いきません。",english:"Because it is raining, I will not go."}]}
    ]
  },
  {
    id:"n5-made",level:"N5",pattern:"まで",title:"Until / as far as",short:"Marks an endpoint in time or space.",
    explanation:"まで marks the point where something ends, such as a time, place, or range. It often translates as “until” or “as far as”.",
    usages:[
      {title:"Until a time",examples:[{japanese:"5時まで働きます。",furigana:"ごじまではたらきます。",english:"I work until 5 o'clock."}]},
      {title:"As far as a place",examples:[{japanese:"駅まで歩きます。",furigana:"えきまであるきます。",english:"I walk as far as the station."}]}
    ]
  },
  {
    id:"n5-dake",level:"N5",pattern:"だけ",title:"Only / just",short:"Limits something to the stated amount or thing.",
    explanation:"だけ means “only” or “just” and limits what is being talked about. It can follow nouns and other forms.",
    usages:[
      {title:"Only one thing",examples:[
        {japanese:"水だけ飲みます。",furigana:"みずだけのみます。",english:"I only drink water."},
        {japanese:"これだけです。",furigana:"これだけです。",english:"This is all."}]}
    ]
  },
  {
    id:"n5-kedo",level:"N5",pattern:"けど",title:"But / though",short:"Connects ideas with a contrast or softens what comes next.",
    explanation:"けど means “but” or “though” and connects two ideas that contrast. It can also be left at the end of a sentence to soften an unfinished thought or invitation.",
    usages:[
      {title:"Contrast",examples:[{japanese:"高いけど、買います。",furigana:"たかいけど、かいます。",english:"It is expensive, but I will buy it."}]},
      {title:"Softening a statement",examples:[{japanese:"ちょっと聞きたいんですけど…。",furigana:"ちょっとききたいんですけど…。",english:"I wanted to ask you something..."}]}
    ],notes:"けれど and けれども are more formal variants with a similar basic meaning."
  },
  {
    id:"n5-demo",level:"N5",pattern:"でも",title:"But / however",short:"Introduces a contrasting idea.",
    explanation:"でも commonly means “but” or “however” at the start of a sentence. It can also mean “even” in other constructions, but that use is better treated separately.",
    usages:[
      {title:"Contrasting sentences",examples:[{japanese:"行きたいです。でも、時間がありません。",furigana:"いきたいです。でも、じかんがありません。",english:"I want to go. But I don't have time."}]}
    ]
  },
  {
    id:"n5-mashou",level:"N5",pattern:"～ましょう",title:"Let's / shall we",short:"Suggests doing something together.",
    explanation:"～ましょう is a polite way to suggest that the speaker and listener do something together. It can also be used to accept or make a group proposal.",
    usages:[
      {title:"Making a suggestion",examples:[
        {japanese:"一緒に行きましょう。",furigana:"いっしょにいきましょう。",english:"Let's go together."},
        {japanese:"休みましょう。",furigana:"やすみましょう。",english:"Let's take a break."}]}
    ]
  },
  {
    id:"n5-masenk-a",level:"N5",pattern:"～ませんか",title:"Would you like to…?",short:"Makes a polite invitation or suggestion.",
    explanation:"～ませんか is a polite way to invite someone to do something. Although it contains the negative form ません, the overall meaning is usually an invitation rather than a refusal.",
    usages:[
      {title:"Invitation",examples:[
        {japanese:"一緒に映画を見ませんか。",furigana:"いっしょにえいがをみませんか。",english:"Would you like to watch a movie together?"},
        {japanese:"コーヒーを飲みませんか。",furigana:"コーヒーをのみませんか。",english:"Would you like some coffee?"}]}
    ]
  },
  {
    id:"n5-mashouka",level:"N5",pattern:"～ましょうか",title:"Shall I…? / Shall we…?",short:"Offers to do something or asks whether to do something together.",
    explanation:"～ましょうか can be used to offer to do something for someone or to suggest doing something together. The situation usually makes the intended meaning clear.",
    usages:[
      {title:"Offering help",examples:[{japanese:"手伝いましょうか。",furigana:"てつだいましょうか。",english:"Shall I help?"}]},
      {title:"Suggesting an action",examples:[{japanese:"そろそろ帰りましょうか。",furigana:"そろそろかえりましょうか。",english:"Shall we head home soon?"}]}
    ]
  },
  {
    id:"n5-te-kudasai",level:"N5",pattern:"～てください",title:"Please do",short:"Makes a polite request.",
    explanation:"～てください asks someone to do an action in a polite way. It is formed with the verb's て-form followed by ください.",
    usages:[
      {title:"Request",examples:[
        {japanese:"ちょっと待ってください。",furigana:"ちょっとまってください。",english:"Please wait a moment."},
        {japanese:"ここに名前を書いてください。",furigana:"ここになまえをかいてください。",english:"Please write your name here."}]}
    ]
  },
  {
    id:"n5-naide-kudasai",level:"N5",pattern:"～ないでください",title:"Please don't",short:"Makes a polite request not to do something.",
    explanation:"～ないでください asks someone not to do an action. It uses the negative ない-form followed by でください.",
    usages:[
      {title:"Request not to do something",examples:[
        {japanese:"ここで写真を撮らないでください。",furigana:"ここでしゃしんをとらないでください。",english:"Please do not take photos here."},
        {japanese:"忘れないでください。",furigana:"わすれないでください。",english:"Please don't forget."}]}
    ]
  },
  {
    id:"n5-hoshii",level:"N5",pattern:"～がほしい",title:"Want a thing",short:"Says that you want a particular thing.",
    explanation:"～がほしい expresses a desire to have or get something. It is used with a noun marked by が.",
    usages:[
      {title:"Wanting something",examples:[
        {japanese:"新しい車がほしいです。",furigana:"あたらしいくるまがほしいです。",english:"I want a new car."},
        {japanese:"水がほしいです。",furigana:"みずがほしいです。",english:"I want some water."}]}
    ]
  },
  {
    id:"n5-hou-ga-ii",level:"N5",pattern:"～ほうがいい",title:"Should / it is better to",short:"Gives simple advice about what is better to do.",
    explanation:"～ほうがいい is used to say that one choice is better than another. With verbs, it commonly gives advice such as “you should...” or “you had better...”.",
    usages:[
      {title:"Advice to do something",examples:[{japanese:"早く寝たほうがいいです。",furigana:"はやくねたほうがいいです。",english:"You should go to bed early."}]},
      {title:"Advice not to do something",examples:[{japanese:"無理をしないほうがいいです。",furigana:"むりをしないほうがいいです。",english:"You should not push yourself."}]}
    ]
  },
  {
    id:"n5-ga-hoshii",level:"N5",pattern:"～がある / ～がいる",title:"There is / there are",short:"Describes existence, using different verbs for things and living beings.",
    explanation:"Use ある for non-living things and いる for people and animals. The thing or person that exists is usually marked with が.",
    usages:[
      {title:"Non-living thing",examples:[{japanese:"机の上に本があります。",furigana:"つくえのうえにほんがあります。",english:"There is a book on the desk."}]},
      {title:"Person or animal",examples:[{japanese:"公園に子どもがいます。",furigana:"こうえんにこどもがいます。",english:"There are children in the park."}]}
    ],notes:"The separate あります and います entries above focus on each verb; this entry highlights the contrast."
  },
  {
    id:"n5-kata",level:"N5",pattern:"～方（かた）",title:"Way of doing something",short:"Turns a verb stem into a noun meaning “way of doing”.",
    explanation:"～方 is attached to a verb stem to talk about the way or method of doing something. It is useful for asking or explaining how to use or do something.",
    usages:[
      {title:"How to do something",examples:[
        {japanese:"使い方を教えてください。",furigana:"つかいかたをおしえてください。",english:"Please teach me how to use it."},
        {japanese:"日本語の話し方が分かりません。",furigana:"にほんごのはなしかたがわかりません。",english:"I don't know how to speak Japanese."}]}
    ]
  },
  {
    id:"n5-mae-ni",level:"N5",pattern:"～前に",title:"Before doing / before",short:"Says that something happens before another event.",
    explanation:"～前に means “before” and can be used with nouns or the dictionary form of verbs. It places one event earlier than another.",
    usages:[
      {title:"Before an action",examples:[{japanese:"寝る前に歯を磨きます。",furigana:"ねるまえにはをみがきます。",english:"I brush my teeth before going to bed."}]},
      {title:"Before a time or event",examples:[{japanese:"三日前に日本へ来ました。",furigana:"みっかまえににほんへきました。",english:"I came to Japan three days ago."}]}
    ]
  },
  {
    id:"n5-jouzu",level:"N5",pattern:"上手 / 下手",title:"Good / bad at",short:"Describes someone's skill at doing something.",
    explanation:"上手 means “good at” and 下手 means “bad at”. They are commonly used with が to describe ability or skill.",
    usages:[
      {title:"Good at something",examples:[{japanese:"私は料理が上手です。",furigana:"わたしはりょうりがじょうずです。",english:"I am good at cooking."}]},
      {title:"Not good at something",examples:[{japanese:"私は歌が下手です。",furigana:"わたしはうたがへたです。",english:"I am bad at singing."}]}
    ]
  },
  {
    id:"n5-suki",level:"N5",pattern:"好き / 嫌い",title:"Like / dislike",short:"Describes things you like or dislike.",
    explanation:"好き means “like” and 嫌い means “dislike”. Japanese treats these as な-adjectives, and the thing you like or dislike is commonly marked with が.",
    usages:[
      {title:"Like",examples:[{japanese:"私は日本語が好きです。",furigana:"わたしはにほんごがすきです。",english:"I like Japanese."}]},
      {title:"Dislike",examples:[{japanese:"魚が嫌いです。",furigana:"さかながきらいです。",english:"I dislike fish."}]}
    ]
  },
  {
    id:"n5-suki-na",level:"N5",pattern:"～が好き",title:"Like something",short:"Says that you like a person, thing, or activity.",
    explanation:"～が好き describes what someone likes, with the liked thing marked by が. The pattern is especially useful because English uses a verb (“like”) where Japanese uses an adjective.",
    usages:[
      {title:"Liking a thing",examples:[{japanese:"音楽が好きです。",furigana:"おんがくがすきです。",english:"I like music."}]},
      {title:"Liking an activity",examples:[{japanese:"日本語を勉強するのが好きです。",furigana:"にほんごをべんきょうするのがすきです。",english:"I like studying Japanese."}]}
    ]
  },
  {
    id:"n5-chotto",level:"N5",pattern:"ちょっと",title:"A little / somewhat",short:"Means “a little” and is also often used to soften a statement or refusal.",
    explanation:"ちょっと means “a little” or “a bit”. In conversation it can also soften a negative response, sometimes implying “that may be difficult” without saying no directly.",
    usages:[
      {title:"A little",examples:[{japanese:"日本語がちょっと分かります。",furigana:"にほんごがちょっとわかります。",english:"I understand a little Japanese."}]},
      {title:"Softening a response",examples:[{japanese:"今日はちょっと…。",furigana:"きょうはちょっと…。",english:"Today might be a little difficult..."}]}
    ]
  },
  {
    id:"n5-ichiban",level:"N5",pattern:"一番",title:"The most / number one",short:"Marks the highest degree within a group.",
    explanation:"一番 means “the most” or “number one” and is used when comparing three or more things. It usually comes before an adjective or other comparison phrase.",
    usages:[
      {title:"The most",examples:[
        {japanese:"これが一番好きです。",furigana:"これがいちばんすきです。",english:"I like this the most."},
        {japanese:"日本で一番高い山です。",furigana:"にほんでいちばんたかいやまです。",english:"It is the tallest mountain in Japan."}]}
    ]
  },
  {
    id:"n5-yori-hou",level:"N5",pattern:"AよりBのほうが",title:"B is more than A",short:"Compares two things and says B has more of a quality than A.",
    explanation:"AよりBのほうが compares two things and says that B is more [adjective] than A. The adjective comes after のほうが.",
    usages:[
      {title:"Simple comparison",examples:[{japanese:"犬より猫のほうが好きです。",furigana:"いぬよりねこのほうがすきです。",english:"I like cats more than dogs."}]},
      {title:"Comparing qualities",examples:[{japanese:"電車より車のほうが速いです。",furigana:"でんしゃよりくるまのほうがはやいです。",english:"Cars are faster than trains."}]}
    ]
  },
  {
    id:"n5-issho-ni",level:"N5",pattern:"一緒に",title:"Together",short:"Says that people do something together.",
    explanation:"一緒に means “together” and commonly comes before a verb. It is often used with invitations and suggestions.",
    usages:[
      {title:"Doing something together",examples:[
        {japanese:"一緒に勉強しましょう。",furigana:"いっしょにべんきょうしましょう。",english:"Let's study together."},
        {japanese:"友達と一緒に行きます。",furigana:"ともだちといっしょにいきます。",english:"I go together with my friend."}]}
    ]
  },
  {
    id:"n5-toki",level:"N5",pattern:"～時",title:"When / at the time",short:"Says when something happens or happened.",
    explanation:"～時 means “when” or “at the time” and connects an event with the time it occurs. It can follow nouns, adjectives, and verb forms.",
    usages:[
      {title:"When doing something",examples:[{japanese:"日本へ行く時、写真を撮ります。",furigana:"にほんへいくとき、しゃしんをとります。",english:"When I go to Japan, I take photos."}]},
      {title:"At a specific time",examples:[{japanese:"子どもの時、よくここに来ました。",furigana:"こどものとき、よくここにきました。",english:"When I was a child, I often came here."}]}
    ]
  },
  {
    id:"n5-te-mo-ii",level:"N5",pattern:"～てもいい",title:"May / it is okay to",short:"Asks for or gives permission to do something.",
    explanation:"～てもいい means that an action is permitted or acceptable. In a question, it is commonly used to ask “May I...?”",
    usages:[
      {title:"Asking permission",examples:[{japanese:"ここに座ってもいいですか。",furigana:"ここにすわってもいいですか。",english:"May I sit here?"}]},
      {title:"Giving permission",examples:[{japanese:"写真を撮ってもいいです。",furigana:"しゃしんをとってもいいです。",english:"You may take photos."}]}
    ]
  },
  {
    id:"n5-te-wa-ikenai",level:"N5",pattern:"～てはいけない",title:"Must not / not allowed",short:"Says that an action is forbidden or not allowed.",
    explanation:"～てはいけない says that someone must not do something or that an action is not allowed. A more polite version is ～てはいけません.",
    usages:[
      {title:"Prohibition",examples:[
        {japanese:"ここで写真を撮ってはいけません。",furigana:"ここでしゃしんをとってはいけません。",english:"You must not take photos here."},
        {japanese:"この部屋に入ってはいけません。",furigana:"このへやにはいってはいけません。",english:"You must not enter this room."}]}
    ]
  },
  {
    id:"n5-nakereba",level:"N5",pattern:"～なければならない",title:"Must / have to",short:"Says that something is necessary or required.",
    explanation:"～なければならない means “must” or “have to”. It is formed from the negative ない-form and expresses an obligation to do the action.",
    usages:[
      {title:"Obligation",examples:[
        {japanese:"明日、学校へ行かなければなりません。",furigana:"あした、がっこうへいかなければなりません。",english:"I have to go to school tomorrow."}]}
    ],notes:"A common spoken alternative is ～ないといけない."
  },
  {
    id:"n5-nai-to-ikenai",level:"N5",pattern:"～ないといけない",title:"Must / have to",short:"A common conversational way to say that something must be done.",
    explanation:"～ないといけない expresses an obligation to do something. It is common in everyday conversation and is similar in meaning to ～なければならない.",
    usages:[
      {title:"Everyday obligation",examples:[{japanese:"もう帰らないといけません。",furigana:"もうかえらないといけません。",english:"I have to go home now."}]}
    ]
  },
  {
    id:"n5-tari-tari",level:"N5",pattern:"～たり～たりする",title:"Do things such as A and B",short:"Lists representative actions without giving a complete list.",
    explanation:"～たり～たりする lists examples of actions that someone does, often with the sense of “do things like A and B”. The list does not have to include every action.",
    usages:[
      {title:"Listing activities",examples:[{japanese:"週末は映画を見たり、本を読んだりします。",furigana:"しゅうまつはえいがをみたり、ほんをよんだりします。",english:"On weekends I do things like watch movies and read books."}]}
    ]
  },
  {
    id:"n5-koto-ga-dekiru",level:"N5",pattern:"～ことができる",title:"Can / be able to",short:"Says that someone has the ability or opportunity to do something.",
    explanation:"～ことができる means “can” or “be able to” and is used with the dictionary form of a verb. It describes ability or possibility.",
    usages:[
      {title:"Ability",examples:[{japanese:"日本語を話すことができます。",furigana:"にほんごをはなすことができます。",english:"I can speak Japanese."}]},
      {title:"Possibility",examples:[{japanese:"ここでカードを使うことができます。",furigana:"ここでカードをつかうことができます。",english:"You can use a card here."}]}
    ]
  },
  {
    id:"n5-koto-ga-suki",level:"N5",pattern:"～ことが好き",title:"Like doing something",short:"Uses a verb as a noun to say you like an activity.",
    explanation:"～こと turns a verb phrase into a noun-like expression, allowing you to say that you like or dislike an activity. This is common with 好き and 嫌い.",
    usages:[
      {title:"Liking an activity",examples:[{japanese:"本を読むことが好きです。",furigana:"ほんをよむことがすきです。",english:"I like reading books."}]}
    ]
  },
  {
    id:"n5-ndesu",level:"N5",pattern:"～んです",title:"Explaining / adding context",short:"Adds an explanatory or contextual feeling to a statement or question.",
    explanation:"～んです is used when explaining a situation, giving background, or asking for an explanation. It often makes the connection to the surrounding context clearer.",
    usages:[
      {title:"Giving an explanation",examples:[{japanese:"今日は休みなんです。",furigana:"きょうはやすみなんです。",english:"You see, today is a day off."}]},
      {title:"Asking for context",examples:[{japanese:"どうしたんですか。",furigana:"どうしたんですか。",english:"What happened? / What's wrong?"}]}
    ],notes:"In polite speech, nouns and な-adjectives commonly use なんです."
  },
  {
    id:"n5-deshou",level:"N5",pattern:"でしょう",title:"Probably / I think / right?",short:"Expresses a guess, expectation, or request for agreement.",
    explanation:"でしょう can show that the speaker thinks something is likely or can invite agreement. It is softer and less certain than a direct statement.",
    usages:[
      {title:"Probably / likely",examples:[{japanese:"明日は雨でしょう。",furigana:"あしたはあめでしょう。",english:"It will probably rain tomorrow."}]},
      {title:"Seeking agreement",examples:[{japanese:"難しいでしょう？",furigana:"むずかしいでしょう？",english:"It's difficult, right?"}]}
    ]
  },
  {
    id:"n5-darou",level:"N5",pattern:"だろう",title:"Probably / I think",short:"A more casual form used for a guess or expectation.",
    explanation:"だろう is a casual way to express a guess, expectation, or “probably”. It is related to the more polite でしょう.",
    usages:[
      {title:"Making a guess",examples:[{japanese:"明日は晴れるだろう。",furigana:"あしたははれるだろう。",english:"It will probably be sunny tomorrow."}]}
    ]
  },
  {
    id:"n5-donna",level:"N5",pattern:"どんな",title:"What kind of",short:"Asks what type or kind of thing something is.",
    explanation:"どんな comes before a noun to ask what kind or type of thing it is. The answer normally describes the noun.",
    usages:[
      {title:"Asking about a type",examples:[{japanese:"どんな音楽が好きですか。",furigana:"どんなおんがくがすきですか。",english:"What kind of music do you like?"}]}
    ]
  },
  {
    id:"n5-zenzen",level:"N5",pattern:"全然～ない",title:"Not at all",short:"Emphasizes that something is not true or does not happen at all.",
    explanation:"全然 is commonly used with a negative expression to mean “not at all” or “not in the slightest”. It strongly emphasizes the negative.",
    usages:[
      {title:"Not at all",examples:[
        {japanese:"日本語が全然分かりません。",furigana:"にほんごがぜんぜんわかりません。",english:"I do not understand Japanese at all."},
        {japanese:"全然食べませんでした。",furigana:"ぜんぜんたべませんでした。",english:"I did not eat at all."}]}
    ]
  },
  {
    id:"n5-amari",level:"N5",pattern:"あまり～ない",title:"Not very / not much",short:"Softens a negative statement to mean “not very” or “not much”.",
    explanation:"あまり is commonly used with a negative expression to mean “not very” or “not much”. It makes a negative statement less absolute than 全然～ない.",
    usages:[
      {title:"Not very",examples:[{japanese:"日本語があまり上手ではありません。",furigana:"にほんごがあまりじょうずではありません。",english:"I am not very good at Japanese."}]}
    ]
  },
  {
    id:"n5-soshite",level:"N5",pattern:"そして",title:"And / and then",short:"Connects related statements or events.",
    explanation:"そして connects sentences or ideas and can mean “and” or “and then”. It is useful for describing a sequence or adding related information.",
    usages:[
      {title:"Connecting events",examples:[{japanese:"朝ご飯を食べました。そして、学校へ行きました。",furigana:"あさごはんをたべました。そして、がっこうへいきました。",english:"I ate breakfast. Then I went to school."}]}
    ]
  },
  {
    id:"n5-sorekara",level:"N5",pattern:"それから",title:"After that / and then",short:"Shows what happens next in a sequence.",
    explanation:"それから means “after that” or “and then” and is commonly used to connect events in chronological order.",
    usages:[
      {title:"Sequence",examples:[{japanese:"昼ご飯を食べました。それから、買い物をしました。",furigana:"ひるごはんをたべました。それから、かいものをしました。",english:"I ate lunch. After that, I went shopping."}]}
    ]
  },
  {
    id:"n5-ato-de",level:"N5",pattern:"～後で",title:"After",short:"Says that something happens after another action or time.",
    explanation:"～後で means “after” and places one event later than another. It can follow a noun or the past form of a verb.",
    usages:[
      {title:"After an action",examples:[{japanese:"仕事の後で、映画を見ます。",furigana:"しごとのあとで、えいがをみます。",english:"I will watch a movie after work."}]},
      {title:"After doing something",examples:[{japanese:"ご飯を食べた後で、勉強します。",furigana:"ごはんをたべたあとで、べんきょうします。",english:"I study after eating."}]}
    ]
  },
  {
    id:"n5-nagara",level:"N5",pattern:"～ながら",title:"While doing",short:"Describes two actions happening at the same time.",
    explanation:"～ながら connects two actions done by the same person at the same time. It is attached to the verb stem of the secondary action.",
    usages:[
      {title:"Two actions at once",examples:[{japanese:"音楽を聞きながら勉強します。",furigana:"おんがくをききながらべんきょうします。",english:"I study while listening to music."}]}
    ]
  },
  {
    id:"n5-nara",level:"N5",pattern:"～なら",title:"If it is / if you're talking about",short:"Sets up a condition or topic based on information already mentioned.",
    explanation:"～なら can mean “if it is...” or “if you're talking about...”. It is often used when responding to information or choosing something based on a condition.",
    usages:[
      {title:"If that is the case",examples:[{japanese:"明日なら大丈夫です。",furigana:"あしたならだいじょうぶです。",english:"If it is tomorrow, that's fine."}]}
    ]
  },
  {
    id:"n5-tara",level:"N5",pattern:"～たら",title:"If / when / after",short:"Introduces a condition or says what happens after something.",
    explanation:"～たら can mean “if”, “when”, or “after”, depending on context. It is formed from the past form of a verb or adjective followed by ら.",
    usages:[
      {title:"If",examples:[{japanese:"時間があったら、行きます。",furigana:"じかんがあったら、いきます。",english:"If I have time, I will go."}]},
      {title:"When / after",examples:[{japanese:"家に帰ったら、電話します。",furigana:"いえにかえったら、でんわします。",english:"When I get home, I will call."}]}
    ]
  },
  {
    id:"n5-plain-form",level:"N5",pattern:"普通形",title:"Plain / casual forms",short:"Basic non-polite verb and adjective forms used in casual speech and before many grammar patterns.",
    explanation:"Plain forms are the basic casual forms of Japanese verbs and adjectives, such as 食べる, 食べない, 食べた, and 食べなかった. They are also used before many grammar patterns.",
    usages:[
      {title:"Casual statement",examples:[{japanese:"明日、学校に行く。",furigana:"あした、がっこうにいく。",english:"I am going to school tomorrow."}]},
      {title:"Before another grammar pattern",examples:[{japanese:"日本語を話すことができます。",furigana:"にほんごをはなすことができます。",english:"I can speak Japanese."}]}
    ],notes:"This is a foundation rather than a single suffix; the exact plain form depends on the verb or adjective."
  }
];

const N4_GRAMMAR = [
  {
    id: "n4-te-ageru", level: "N4", pattern: "～てあげる", title: "Doing something for someone", short: "Used when performing an action as a favor for someone else.",
    explanation: "～てあげる expresses doing an action for someone else as a favor or act of kindness. It is used when the speaker (or someone on the speaker's side) does something for another person.",
    usages: [
      { title: "Doing a favor", examples: [
        { japanese: "友達に日本語を教えてあげました。", furigana: "ともだちににほんごをおしえてあげました。", english: "I taught Japanese to my friend." },
        { japanese: "弟に宿題を手伝ってあげた。", furigana: "おとうとにしゅくだいをてつだってあげた。", english: "I helped my little brother with his homework." }
      ]},
      { title: "Offering help", examples: [
        { japanese: "荷物を持ってあげましょうか。", furigana: "にもつをもってあげましょうか。", english: "Shall I carry your luggage for you?" },
        { japanese: "道を教えてあげましょうか。", furigana: "みちをおしえてあげましょうか。", english: "Shall I show you the way?" }
      ]},
      { title: "Past action as favor", examples: [
        { japanese: "もうすぐ夏休みだから、子供にゲームを買ってあげるつもりです。", furigana: "もうすぐなつやすみだから、こどもにゲームをかってあげるつもりです。", english: "I'll buy a game for my child soon because summer vacation is coming." }
      ]}
    ], notes: "Avoid using this directly to superiors or strangers as it can sound patronizing. Use ～て差し上げる for humble contexts."
  },
  {
    id: "n4-te-kureru", level: "N4", pattern: "～てくれる", title: "Someone does a favor for me", short: "Used when someone performs an action as a favor for you.",
    explanation: "～てくれる is used when someone else performs an action that benefits the speaker or someone in the speaker's inner circle.",
    usages: [
      { title: "Receiving a favor", examples: [
        { japanese: "田中さんが車で送ってくれました。", furigana: "たなかさんがくるまでおくってくれました。", english: "Tanaka gave me a ride home." },
        { japanese: "先生が質問に答えてくれた。", furigana: "せんせいがしつもんにこたえてくれた。", english: "The teacher answered my question." }
      ]},
      { title: "Asking for help", examples: [
        { japanese: "手伝ってくれますか。", furigana: "てつだってくれますか。", english: "Will you help me?" },
        { japanese: "ちょっと見てくれませんか。", furigana: "ちょっとみてくれませんか。", english: "Could you take a look for me?" }
      ]},
      { title: "Gratitude for past action", examples: [
        { japanese: "本当に助けてくれてありがとう。", furigana: "ほんとうにたすけてくれてありがとう。", english: "Thank you so much for helping me." }
      ]}
    ]
  },
  {
    id: "n4-te-morau", level: "N4", pattern: "～てもらう", title: "Receiving an action / having someone do something", short: "Used when you request or get someone to perform an action for you.",
    explanation: "～てもらう describes receiving a favor or getting someone to perform an action for you. The person who performs the action is marked with に.",
    usages: [
      { title: "Receiving help", examples: [
        { japanese: "私は先生に漢字を直してもらいました。", furigana: "わたしはせんせいにかんじをなおしてもらいました。", english: "I had my teacher correct my kanji." },
        { japanese: "友達に写真を撮ってもらった。", furigana: "ともだちにしゃしんをとってもらった。", english: "I had my friend take a photo." }
      ]},
      { title: "Requesting a service", examples: [
        { japanese: "美容院に髪を切ってもらいました。", furigana: "びよういんにかみをきってもらいました。", english: "I had my hair cut at the salon." },
        { japanese: "医者に診てもらったほうがいいよ。", furigana: "いしゃにみてもらったほうがいいよ。", english: "You should have a doctor look at it." }
      ]},
      { title: "Getting someone to do something for you", examples: [
        { japanese: "同僚に仕事を手伝ってもらった。", furigana: "どうりょうにしごとをてつだってもらった。", english: "I got my colleague to help me with my work." }
      ]}
    ]
  },
  {
    id: "n4-passive", level: "N4", pattern: "～される / ～られる", title: "Passive voice", short: "Shows that an action is done to the subject.",
    explanation: "The passive form is used when the subject receives an action. Japanese also uses a 'suffering passive' where an action negatively impacts the speaker.",
    usages: [
      { title: "Standard passive", examples: [
        { japanese: "この本は多くの人に読まれています。", furigana: "このほんはおおくのひとによまれています。", english: "This book is read by many people." },
        { japanese: "その映画は若者に好まれている。", furigana: "そのえいがはわかものにこのまれている。", english: "That movie is liked by young people." }
      ]},
      { title: "Suffering passive", examples: [
        { japanese: "雨に降られました。", furigana: "あめにふられました。", english: "I got rained on." },
        { japanese: "電車の中で足を踏まれた。", furigana: "でんしゃのなかであしをふまれた。", english: "Someone stepped on my foot on the train." }
      ]},
      { title: "Indirect passive", examples: [
        { japanese: "隣の人にタバコを吸われて、眠れなかった。", furigana: "となりのひとにタバコをすわれて、ねむれなかった。", english: "The person next to me smoked, so I couldn't sleep." }
      ]}
    ]
  },
  {
    id: "n4-causative", level: "N4", pattern: "～させる / ～せられる", title: "Causative voice", short: "Expresses making or letting someone do something.",
    explanation: "The causative form shows that a person makes or allows someone else to perform an action.",
    usages: [
      { title: "Making someone do something", examples: [
        { japanese: "先生は学生に宿題をさせました。", furigana: "せんせいはがくせいにしゅくだいをさせました。", english: "The teacher made the students do homework." },
        { japanese: "父は私にピアノを練習させた。", furigana: "ちちはわたしにピアノをれんしゅうさせた。", english: "My father made me practice the piano." }
      ]},
      { title: "Letting someone do something", examples: [
        { japanese: "子供に好きなものを食べさせます。", furigana: "こどもにすきなものをたべさせます。", english: "I let my child eat what they like." },
        { japanese: "弟にゲームをさせてあげた。", furigana: "おとうとにゲームをさせてあげた。", english: "I let my younger brother play games." }
      ]}
    ]
  },
  {
    id: "n4-causative-passive", level: "N4", pattern: "～させられる", title: "Causative-Passive voice", short: "Expresses being forced to do something against your will.",
    explanation: "Combines causative and passive meanings to show that the speaker was made to do an action by someone else.",
    usages: [
      { title: "Forced action", examples: [
        { japanese: "昨日、母に部屋を掃除させられました。", furigana: "きのう、ははにへやをそうじさせられました。", english: "Yesterday, I was forced by my mother to clean my room." },
        { japanese: "仕事を残業させられた。", furigana: "しごとをざんぎょうさせられた。", english: "I was forced to work overtime." }
      ]},
      { title: "Unwilling compliance", examples: [
        { japanese: "嫌な薬を飲まされた。", furigana: "いやなくすりをのまされた。", english: "I was forced to take unpleasant medicine." },
        { japanese: "上司に無理な仕事をさせられた。", furigana: "じょうしにむりなしごとをさせられた。", english: "My boss made me do an unreasonable task." }
      ]}
    ]
  },
  {
    id: "n4-sou-da-looks", level: "N4", pattern: "～そうだ（様態）", title: "Looks like / appears to be", short: "Expresses a visual impression or impression of likelihood.",
    explanation: "Attached to verb stems or adjective bases to express that something looks like it will happen or seems to possess a quality.",
    usages: [
      { title: "Visual impression", examples: [
        { japanese: "このケーキは美味しそうです。", furigana: "このケーキはおいしそうです。", english: "This cake looks delicious." },
        { japanese: "彼は楽しそうに話している。", furigana: "かれはたのしそうにはなしている。", english: "He looks like he's enjoying the conversation." }
      ]},
      { title: "Imminent event", examples: [
        { japanese: "今にも雨が降りそうです。", furigana: "いまにもあめがふりそうです。", english: "It looks like it will rain at any moment." },
        { japanese: "この仕事は時間がかかりそうだ。", furigana: "このしごとはじかんがかかりそうだ。", english: "This work looks like it will take time." }
      ]},
      { title: "Negative form", examples: [
        { japanese: "この本は面白くなさそうだ。", furigana: "このほんはおもしろくなさそうだ。", english: "This book doesn't look interesting." },
        { japanese: "明日は雨が降らなさそうだ。", furigana: "あしたはあめがふらなさそうだ。", english: "It doesn't look like it will rain tomorrow." }
      ]},
      { title: "いい → よさそう", examples: [
        { japanese: "この車はよさそうだ。", furigana: "このくるまはよさそうだ。", english: "This car looks good." }
      ]}
    ], notes: "The negative for いい is よさそう, and for ない is なさそう."
  },
  {
    id: "n4-sou-da-hearsay", level: "N4", pattern: "～そうだ（伝聞）", title: "I heard that / rumor", short: "Used to report information you heard from another source.",
    explanation: "Attached to the plain form of verbs, adjectives, and nouns to state facts or news heard from somewhere else.",
    usages: [
      { title: "Reporting news", examples: [
        { japanese: "天気予報によると、明日は雨が降るそうです。", furigana: "てんきよほうによると、あしたはあめがふるそうです。", english: "According to the weather forecast, I heard it will rain tomorrow." },
        { japanese: "田中さんは来月結婚するそうです。", furigana: "たなかさんはらいげつけっこんするそうです。", english: "I heard Tanaka is getting married next month." }
      ]},
      { title: "Rumors", examples: [
        { japanese: "彼は有名な学者だそうです。", furigana: "かれはゆうめいながくしゃだそうです。", english: "I heard he's a famous scholar." },
        { japanese: "このレストランは美味しいそうですよ。", furigana: "このレストランはおいしいそうですよ。", english: "I hear this restaurant is delicious." }
      ]}
    ]
  },
  {
    id: "n4-youdes", level: "N4", pattern: "～ようだ / ～ようです", title: "It seems / looks like", short: "Expresses a logical conjecture based on sensory evidence.",
    explanation: "Used to state a soft judgment or observation based on what the speaker sees, hears, or senses.",
    usages: [
      { title: "Conjecture", examples: [
        { japanese: "外は寒いようです。", furigana: "そとはさむいようです。", english: "It seems like it is cold outside." },
        { japanese: "誰かが来たようです。", furigana: "だれかがきたようです。", english: "It seems someone came." }
      ]},
      { title: "Based on sight", examples: [
        { japanese: "彼は怒っているようです。", furigana: "かれはおこっているようです。", english: "He seems to be angry." }
      ]},
      { title: "With な-adjectives", examples: [
        { japanese: "彼は元気なようです。", furigana: "かれはげんきなようです。", english: "He seems to be well." }
      ]}
    ]
  },
  {
    id: "n4-mitai", level: "N4", pattern: "～みたい", title: "Looks like / resembles", short: "A casual expression for 'looks like' or 'resembles'.",
    explanation: "Behaves like a な-adjective and functions similarly to ～ようだ, but is much more common in conversational contexts.",
    usages: [
      { title: "Resemblance", examples: [
        { japanese: "彼はまるでお金持ちみたいです。", furigana: "かれはまるでおかねもちみたいです。", english: "He acts just like a rich person." },
        { japanese: "この料理は美味しみたいだね。", furigana: "このりょうりはおいしみたいだね。", english: "This dish looks delicious, right?" }
      ]},
      { title: "Conjecture", examples: [
        { japanese: "明日は雨が降るみたいだよ。", furigana: "あしたはあめがふるみたいだよ。", english: "It looks like it's going to rain tomorrow." },
        { japanese: "彼は病気みたいだ。", furigana: "かれはびょうきみたいだ。", english: "He seems to be sick." }
      ]}
    ]
  },
  {
    id: "n4-volitional", level: "N4", pattern: "意向形 (～よう / ～おう)", title: "Volitional form (Casual)", short: "Casual equivalent of ～ましょう, used for suggestions or intentions.",
    explanation: "Used to make casual proposals, express intention, or form 'let's do X' statements in plain speech.",
    usages: [
      { title: "Casual suggestion", examples: [
        { japanese: "明日、映画を見に行こう。", furigana: "あした、えいがをみにいこう。", english: "Let's go watch a movie tomorrow." },
        { japanese: "一緒に頑張ろう！", furigana: "いっしょにがんばろう！", english: "Let's do our best together!" }
      ]},
      { title: "Expressing intention", examples: [
        { japanese: "海外で働こうと思っている。", furigana: "かいがいではたらこうとおもっている。", english: "I'm thinking about working overseas." },
        { japanese: "来年は日本へ行こうと決めた。", furigana: "らいねんはにほんへいこうときめた。", english: "I decided to go to Japan next year." }
      ]}
    ]
  },
  {
    id: "n4-volitional-omou", level: "N4", pattern: "～と思っています", title: "Plan to / thinking of doing", short: "Expresses an intention or personal decision that you have been considering.",
    explanation: "Pairs the volitional form with と思っています to show an ongoing intention or decision to do something.",
    usages: [
      { title: "Personal plan", examples: [
        { japanese: "来年、日本へ留学しようと思っています。", furigana: "らいねん、にほんへりゅうがくしようとおもっています。", english: "I am thinking of studying abroad in Japan next year." },
        { japanese: "自分で会社を起こそうと思っています。", furigana: "じぶんでかいしゃをおこそうとおもっています。", english: "I'm thinking about starting my own company." }
      ]}
    ]
  },
  {
    id: "n4-yotei", level: "N4", pattern: "～予定です", title: "Plan to / scheduled to", short: "States an official or firm plan/schedule.",
    explanation: "Used after a dictionary-form verb or a noun + の to express a set arrangement or schedule.",
    usages: [
      { title: "Schedule", examples: [
        { japanese: "来月、新しい会社で働く予定です。", furigana: "らいげつ、あたらしいかいしゃではたらくよていです。", english: "I am scheduled to start working at a new company next month." },
        { japanese: "旅行の予定です。", furigana: "りょこうのよていです。", english: "It's the plan for the trip." }
      ]},
      { title: "Past plan", examples: [
        { japanese: "昨日は出かける予定だった。", furigana: "きのうはでかけるよていだった。", english: "I had planned to go out yesterday." }
      ]}
    ]
  },
  {
    id: "n4-tsumori", level: "N4", pattern: "～つもり", title: "Intend to / plan to", short: "States your clear intention or personal plan.",
    explanation: "Follows a verb's dictionary form (or ない-form for negative intentions) to state what you plan to do.",
    usages: [
      { title: "Stating intention", examples: [
        { japanese: "今週末はどこにも出かけないつもりです。", furigana: "こんしゅうまつはどこにもでかけないつもりです。", english: "I intend not to go out anywhere this weekend." },
        { japanese: "大学院に進むつもりだ。", furigana: "だいがくいんにすすむつもりだ。", english: "I intend to go to graduate school." }
      ]},
      { title: "Past intention", examples: [
        { japanese: "もっと早く起きるつもりだった。", furigana: "もっとはやくおきるつもりだった。", english: "I had intended to get up earlier." }
      ]}
    ]
  },
  {
    id: "n4-tame-ni", level: "N4", pattern: "～ために", title: "In order to / for the purpose of", short: "States a purpose or goal driving an action.",
    explanation: "Connects a target goal (dictionary form verb or noun + の) to the deliberate effort made to achieve it.",
    usages: [
      { title: "Purpose", examples: [
        { japanese: "車を買うために、お金をためています。", furigana: "くるまをかうために、おかねをためています。", english: "I am saving money in order to buy a car." },
        { japanese: "健康のために、毎日運動しています。", furigana: "けんこうのために、まいにちうんどうしています。", english: "I exercise every day for my health." }
      ]},
      { title: "Negative purpose", examples: [
        { japanese: "遅刻しないために、早く出かけた。", furigana: "ちこくしないために、はやくでかけた。", english: "I left early so I wouldn't be late." }
      ]}
    ]
  },
  {
    id: "n4-you-ni", level: "N4", pattern: "～ように", title: "So that / in order to", short: "Expresses acting so that a state or condition becomes possible.",
    explanation: "Often used with potential verbs or negative verbs to indicate acting toward an intended state.",
    usages: [
      { title: "Target state", examples: [
        { japanese: "後ろの人にも聞こえるように、大きな声で話しました。", furigana: "うしろのひとにもきこえるように、おおきなこえではなしました。", english: "I spoke loudly so that the people in the back could hear." },
        { japanese: "忘れないようにメモをした。", furigana: "わすれないようにメモをした。", english: "I took notes so I wouldn't forget." }
      ]},
      { title: "Potential verb", examples: [
        { japanese: "日本語が話せるように毎日練習している。", furigana: "にほんごがはなせるようにまいにちれんしゅうしている。", english: "I practice every day so I can speak Japanese." }
      ]}
    ]
  },
  {
    id: "n4-you-ni-naru", level: "N4", pattern: "～ようになる", title: "To reach the point where / become able to", short: "Describes a change in state or ability over time.",
    explanation: "Used with non-volitional or potential verbs to show that someone has acquired a new ability or habit.",
    usages: [
      { title: "Change in ability", examples: [
        { japanese: "毎日練習して、日本語が話せるようになりました。", furigana: "まいにちれんしゅうして、にほんごがはなせるようになりました。", english: "I practiced every day and reached the point where I can speak Japanese." },
        { japanese: "朝起きるようになった。", furigana: "あさおきるようになった。", english: "I've reached the point where I wake up in the morning." }
      ]},
      { title: "Negative change", examples: [
        { japanese: "最近、全然運動しなくなった。", furigana: "さいきん、ぜんぜんうんどうしなくなった。", english: "Lately, I've gotten to the point where I don't exercise at all." }
      ]}
    ]
  },
  {
    id: "n4-ba-form", level: "N4", pattern: "～ば", title: "Conditional 'If'", short: "Expresses a general, logical, or hypothetical condition.",
    explanation: "The ～ば form sets up a conditional statement ('if X happens, then Y'). Often used for general truths and advice.",
    usages: [
      { title: "Condition", examples: [
        { japanese: "安ければ、買います。", furigana: "やすければ、かいます。", english: "If it is cheap, I will buy it." },
        { japanese: "春になれば、花が咲く。", furigana: "はるになれば、はながさく。", english: "When spring comes, flowers bloom." }
      ]},
      { title: "Idiomatic advice", examples: [
        { japanese: "どうすればいいですか。", furigana: "どうすればいいですか。", english: "What should I do?" }
      ]},
      { title: "Negative ば-form", examples: [
        { japanese: "早く行かなければ、間に合わない。", furigana: "はやくいかなければ、まにあわない。", english: "If I don't go early, I won't make it." }
      ]}
    ]
  },
  {
    id: "n4-to-conditional", level: "N4", pattern: "～と", title: "Natural conditional / Whenever", short: "Shows that Y automatically or naturally happens when X occurs.",
    explanation: "Placed after present plain verbs to show that Y is an inevitable consequence, natural phenomenon, or habit.",
    usages: [
      { title: "Natural consequence", examples: [
        { japanese: "このボタンを押すと、お湯が出ます。", furigana: "このボタンをおすと、おゆがでます。", english: "If you press this button, hot water comes out." },
        { japanese: "春になると、暖かくなる。", furigana: "はるになると、あたたかくなる。", english: "When spring comes, it gets warm." }
      ]},
      { title: "Habitual", examples: [
        { japanese: "朝起きると、まずコーヒーを飲む。", furigana: "あさおきると、まずコーヒーをのむ。", english: "When I wake up in the morning, I first drink coffee." }
      ]},
      { title: "Discoveries", examples: [
        { japanese: "窓を開けると、雨が降っていた。", furigana: "まどをあけると、あめがふっていた。", english: "When I opened the window, it was raining." }
      ]}
    ]
  },
  {
    id: "n4-nara-conditional", level: "N4", pattern: "～なら", title: "Contextual conditional / If it is the case that", short: "Used when responding to a situation or topic presented by someone else.",
    explanation: "Provides advice, decisions, or commentary dependent on context provided by another person.",
    usages: [
      { title: "Contextual response", examples: [
        { japanese: "京都へ行くなら、新幹線が便利です。", furigana: "きょうとへいくなら、しんかんせんがべんりです。", english: "If you are going to Kyoto, the bullet train is convenient." },
        { japanese: "時間がないなら、タクシーで行きなさい。", furigana: "じかんがないなら、タクシーでいきなさい。", english: "If you don't have time, take a taxi." }
      ]},
      { title: "With nouns", examples: [
        { japanese: "学生なら、割引があります。", furigana: "がくせいなら、わりびきがあります。", english: "If you're a student, there's a discount." }
      ]}
    ]
  },
  {
    id: "n4-naru", level: "N4", pattern: "～になる", title: "To become", short: "Describes a change of state or transformation.",
    explanation: "Attaches to い-adjectives (～くなる), な-adjectives (～になる), and nouns (～になる) to mean 'to become'.",
    usages: [
      { title: "Transformation", examples: [
        { japanese: "暖かくなりました。", furigana: "あたたかくなりました。", english: "It has become warm." },
        { japanese: "部屋がきれいになりました。", furigana: "へやがきれいになりました。", english: "The room became clean." },
        { japanese: "彼は医者になりました。", furigana: "かれはいしゃになりました。", english: "He became a doctor." }
      ]}
    ]
  },
  {
    id: "n4-suru-change", level: "N4", pattern: "～にする", title: "To make something / decide on", short: "Describes intentionally changing a state or making a choice.",
    explanation: "Used to make something possess a quality (～くする / ～にする) or to state a selection/choice.",
    usages: [
      { title: "Making a choice", examples: [
        { japanese: "コーヒーにします。", furigana: "コーヒーにします。", english: "I will go with coffee." },
        { japanese: "これに決めた。", furigana: "これにきめた。", english: "I decided on this one." }
      ]},
      { title: "Modifying a state", examples: [
        { japanese: "部屋をきれいにしました。", furigana: "へやをきれいにしました。", english: "I cleaned (made clean) my room." },
        { japanese: "声を大きくしました。", furigana: "こえをおおきくしました。", english: "I made my voice louder." }
      ]}
    ]
  },
  {
    id: "n4-naku-te-mo-ii", level: "N4", pattern: "～なくてもいい", title: "Don't have to / optional", short: "States that performing an action is not required.",
    explanation: "Formed by converting a verb to negative, replacing い with く, and adding てもいい.",
    usages: [
      { title: "Absence of obligation", examples: [
        { japanese: "明日は休みだから、早く起きなくてもいいです。", furigana: "あしたはやすみだから、はやくおきなくてもいいです。", english: "Tomorrow is a day off, so you don't have to get up early." },
        { japanese: "全部食べなくてもいいよ。", furigana: "ぜんぶたべなくてもいいよ。", english: "You don't have to eat it all." }
      ]},
      { title: "With い-adjectives", examples: [
        { japanese: "高くなくてもいいです。", furigana: "たかくなくてもいいです。", english: "It doesn't have to be expensive." }
      ]}
    ]
  },
  {
    id: "n4-te-shimau", level: "N4", pattern: "～てしまう", title: "Completely finished / regretful action", short: "Expresses completing an action entirely, or regret over an unintended action.",
    explanation: "Used either to emphasize complete action or to show disappointment/regret that something happened.",
    usages: [
      { title: "Complete action", examples: [
        { japanese: "宿題を全部やってしまいました。", furigana: "しゅくだいをぜんぶやってしまいました。", english: "I completely finished all my homework." },
        { japanese: "やっと仕事を終わらせてしまった。", furigana: "やっとしごとをおわらせてしまった。", english: "I finally got the work done." }
      ]},
      { title: "Regret", examples: [
        { japanese: "財布を落としてしまいました。", furigana: "さいふをおとしてしまいました。", english: "I accidentally dropped my wallet." },
        { japanese: "約束を忘れてしまった。", furigana: "やくそくをわすれてしまった。", english: "I accidentally forgot the promise." }
      ]},
      { title: "Casual contraction", examples: [
        { japanese: "宿題をやっちゃった。", furigana: "しゅくだいをやっちゃった。", english: "I finished my homework. / I accidentally did it. (context-dependent)" }
      ]}
    ]
  },
  {
    id: "n4-te-oku", level: "N4", pattern: "～ておく", title: "Do in advance / preparation", short: "Describes doing an action in advance for future convenience.",
    explanation: "Combines a verb's て-form with おく (to place) to mean preparing for something beforehand.",
    usages: [
      { title: "Preparation", examples: [
        { japanese: "旅行の前にホテルを予約しておきます。", furigana: "りょこうのまえにホテルをよやくしておきます。", english: "I will book a hotel in advance before the trip." },
        { japanese: "後で読むために、本を取っておいた。", furigana: "あとでよむために、ほんをとっておいた。", english: "I put the book aside to read later." }
      ]},
      { title: "Leaving something as is", examples: [
        { japanese: "窓を開けておいてください。", furigana: "まどをあけておいてください。", english: "Please leave the window open." }
      ]}
    ]
  },
  {
    id: "n4-te-miru", level: "N4", pattern: "～てみる", title: "Try doing something", short: "Expresses trying out an action to see what it is like.",
    explanation: "Attached to the て-form of a verb to describe testing or trying an activity.",
    usages: [
      { title: "Trying out", examples: [
        { japanese: "新しい着物を着てみました。", furigana: "あたらしいきものをきてみました。", english: "I tried putting on a new kimono." },
        { japanese: "刺身を食べてみたけど、美味しかった。", furigana: "さしみをたべてみたけど、おいしかった。", english: "I tried sashimi and it was delicious." }
      ]},
      { title: "Test attempt", examples: [
        { japanese: "この問題を解いてみてください。", furigana: "このもんだいをといてみてください。", english: "Please try solving this problem." }
      ]}
    ]
  },
  {
    id: "n4-te-ikukuru", level: "N4", pattern: "～ていく / ～てくる", title: "Directional & temporal continuation", short: "Shows movement toward/away or ongoing progression in time.",
    explanation: "～ていく indicates movement away from the speaker or continuation into the future. ～てくる indicates movement toward the speaker or an action coming up to the present.",
    usages: [
      { title: "Temporal shift (future)", examples: [
        { japanese: "これからも日本語を勉強していきます。", furigana: "これからもにほんごをべんきょうしていきます。", english: "I will keep studying Japanese from now on." }
      ]},
      { title: "Temporal shift (present)", examples: [
        { japanese: "日本語を勉強してきました。", furigana: "にほんごをべんきょうしてきました。", english: "I have been studying Japanese (up to now)." }
      ]},
      { title: "Physical direction", examples: [
        { japanese: "子供が走っていった。", furigana: "こどもがはしっていった。", english: "The child ran away." },
        { japanese: "友達が走ってきた。", furigana: "ともだちがはしってきた。", english: "My friend came running." }
      ]}
    ]
  },
  {
    id: "n4-te-moraeru", level: "N4", pattern: "～てもらえる / ～ていただけますか", title: "Polite request for action", short: "Politely asks if someone can do something for you.",
    explanation: "Uses potential/polite forms of もらう to form softer, polite requests.",
    usages: [
      { title: "Polite request", examples: [
        { japanese: "写真を撮っていただけますか。", furigana: "しゃしんをとっていただけますか。", english: "Could you please take a photo for me?" },
        { japanese: "説明していただけませんか。", furigana: "せつめいしていただけませんか。", english: "Could I ask you to explain?" }
      ]},
      { title: "Standard", examples: [
        { japanese: "手伝ってもらえますか。", furigana: "てつだってもらえますか。", english: "Could I get your help?" }
      ]}
    ]
  },
  {
    id: "n4-keigo-sonkeigo", level: "N4", pattern: "尊敬語 (お～になる / 特殊形)", title: "Honorific speech (Sonkeigo)", short: "Used to show respect to actions performed by superior persons.",
    explanation: "Elevates the status of the person performing the action (e.g., customers, bosses, teachers).",
    usages: [
      { title: "Honorific form", examples: [
        { japanese: "社長はもうお帰りになりました。", furigana: "しゃちょうはもうおかえりになりました。", english: "The company president has already returned home." },
        { japanese: "先生は何をおっしゃいましたか。", furigana: "せんせいはなにをおっしゃいましたか。", english: "What did the teacher say?" }
      ]},
      { title: "お～になる", examples: [
        { japanese: "お客様はもうお着きになりました。", furigana: "おきゃくさまはもうおつきになりました。", english: "The customer has already arrived." }
      ]}
    ]
  },
  {
    id: "n4-keigo-kenjougo", level: "N4", pattern: "謙譲語 (お～する / 特殊形)", title: "Humble speech (Kenjougo)", short: "Lowers the speaker's own actions to show respect to others.",
    explanation: "Used when describing actions performed by the speaker or inner group to/for someone respected.",
    usages: [
      { title: "Humble action", examples: [
        { japanese: "明日、お電話いたします。", furigana: "あした、おでんわいたします。", english: "I will call you tomorrow." },
        { japanese: "私が参ります。", furigana: "わたしがまいります。", english: "I will come/go." }
      ]},
      { title: "お～する", examples: [
        { japanese: "お荷物をお持ちいたします。", furigana: "おにもつをおもちいたします。", english: "I will carry your luggage." }
      ]}
    ]
  },
  {
    id: "n4-nasai", level: "N4", pattern: "～なさい", title: "Command / instruction", short: "A firm, authoritative command often used by parents or teachers.",
    explanation: "Attached to the verb stem to give direct, imperative instructions.",
    usages: [
      { title: "Direct command", examples: [
        { japanese: "早く寝なさい。", furigana: "はやくねなさい。", english: "Go to sleep right now." },
        { japanese: "手を洗いなさい。", furigana: "てをあらいなさい。", english: "Wash your hands." }
      ]},
      { title: "Teacher to student", examples: [
        { japanese: "ここに書きなさい。", furigana: "ここにかきなさい。", english: "Write it here." }
      ]}
    ]
  },
  {
    id: "n4-shika-nai", level: "N4", pattern: "～しか～ない", title: "Only / nothing but", short: "Emphasizes that nothing else exists besides what is stated.",
    explanation: "Pairs しか with a negative verb form to emphasize a limitation, similar to 'only'.",
    usages: [
      { title: "Limitation", examples: [
        { japanese: "財布の中に百円しかありません。", furigana: "さいふのなかにひゃくえんしかありません。", english: "There is only 100 yen in my wallet." },
        { japanese: "日本語しか話せません。", furigana: "にほんごしかはなせません。", english: "I can only speak Japanese." }
      ]},
      { title: "With だけ contrast", examples: [
        { japanese: "これだけしかない。", furigana: "これだけしかない。", english: "There's only this much." }
      ]}
    ]
  },
  {
    id: "n4-tokoro-da", level: "N4", pattern: "～ところだ", title: "Just about to / in middle of / just finished", short: "Describes the precise stage of progress of an action.",
    explanation: "Pairs with dictionary form (about to start), ている form (in progress), or た form (just finished).",
    usages: [
      { title: "About to start", examples: [
        { japanese: "今から出かけるところです。", furigana: "いまからでかけるところです。", english: "I am just about to head out." }
      ]},
      { title: "Just completed", examples: [
        { japanese: "今、ご飯を食べたところです。", furigana: "いま、ごはんをたべたところです。", english: "I have just finished eating." }
      ]},
      { title: "In progress", examples: [
        { japanese: "今、調べているところです。", furigana: "いま、しらべているところです。", english: "I'm currently checking on it." }
      ]}
    ]
  },
  {
    id: "n4-nazo-kashira", level: "N4", pattern: "～かしら / ～かな", title: "I wonder...", short: "Expresses internal questioning or informal doubt.",
    explanation: "～かな (unisex/casual) and ～かしら (predominantly feminine) express mild internal speculation.",
    usages: [
      { title: "Wondering", examples: [
        { japanese: "明日は晴れるかな。", furigana: "あしたははれるかな。", english: "I wonder if it will be sunny tomorrow." },
        { japanese: "どうすればいいかな。", furigana: "どうすればいいかな。", english: "I wonder what I should do." }
      ]},
      { title: "Feminine", examples: [
        { japanese: "これでいいかしら。", furigana: "これでいいかしら。", english: "I wonder if this is okay." }
      ]}
    ]
  },
  {
    id: "n4-sugiru", level: "N4", pattern: "～すぎる", title: "Too much / excessively", short: "Expresses doing an action or possessing a quality to excess.",
    explanation: "Attached to verb stems and adjective bases to express going past desirable limits.",
    usages: [
      { title: "Excessive quality", examples: [
        { japanese: "昨日、お酒を飲みすぎました。", furigana: "きのう、おさけをのみすぎました。", english: "I drank too much alcohol yesterday." },
        { japanese: "この料理は辛すぎる。", furigana: "このりょうりはからすぎる。", english: "This dish is too spicy." }
      ]},
      { title: "With な-adjectives", examples: [
        { japanese: "この問題は簡単すぎる。", furigana: "このもんだいはかんたんすぎる。", english: "This problem is too easy." }
      ]},
      { title: "Negative", examples: [
        { japanese: "ちょっと高すぎない？", furigana: "ちょっとたかすぎない？", english: "Isn't it a bit too expensive?" }
      ]}
    ]
  },
  {
    id: "n4-yasuikui", level: "N4", pattern: "～やすい / ～にくい", title: "Easy to / hard to", short: "Describes whether an action is easy or difficult to perform.",
    explanation: "Attached directly to the verb stem to transform the action into an い-adjective.",
    usages: [
      { title: "Easy to do", examples: [
        { japanese: "このペンはとても書きやすいです。", furigana: "このペンはとてもかきやすいです。", english: "This pen is very easy to write with." },
        { japanese: "このパソコンは使いやすい。", furigana: "このパソコンはつかいやすい。", english: "This computer is easy to use." }
      ]},
      { title: "Hard to do", examples: [
        { japanese: "この漢字は覚えにくいです。", furigana: "このかんじはおぼえにくいです。", english: "This kanji is difficult to memorize." },
        { japanese: "彼は話しにくい人だ。", furigana: "かれははなしにくいひとだ。", english: "He's a difficult person to talk to." }
      ]}
    ]
  },
  {
    id: "n4-pukai", level: "N4", pattern: "～はずだ", title: "Should be / expected to be", short: "States a confident expectation based on objective reasons.",
    explanation: "Used when the speaker expects something to be true based on logical deduction or facts.",
    usages: [
      { title: "Expectation", examples: [
        { japanese: "彼は今日来るはずです。", furigana: "かれはきょうくるはずです。", english: "He should be coming today." },
        { japanese: "彼はもう着いたはずだ。", furigana: "かれはもうついたはずだ。", english: "He should have already arrived." }
      ]},
      { title: "Negative", examples: [
        { japanese: "そんなことはないはずだ。", furigana: "そんなことはないはずだ。", english: "That shouldn't be the case." }
      ]}
    ]
  },
  {
    id: "n4-koto-ni-suru", level: "N4", pattern: "～ことにする", title: "Decide to do", short: "Expresses a conscious personal decision.",
    explanation: "Pairs with the plain form of verbs to show a decision that the speaker made personally.",
    usages: [
      { title: "Personal decision", examples: [
        { japanese: "毎日、運動することにしました。", furigana: "まいにち、うんどうすることにしました。", english: "I decided to exercise every day." },
        { japanese: "もうタバコを吸わないことにした。", furigana: "もうタバコをすわないことにした。", english: "I decided not to smoke anymore." }
      ]},
      { title: "Past plan", examples: [
        { japanese: "留学することにしていた。", furigana: "りゅうがくすることにしていた。", english: "I had decided to study abroad." }
      ]}
    ]
  },
  {
    id: "n4-koto-ni-naru", level: "N4", pattern: "～ことになる", title: "It has been decided that", short: "Expresses an arrangement or outcome decided externally.",
    explanation: "Shows that a decision, rule, or schedule was made by outside circumstances or organizations.",
    usages: [
      { title: "External decision", examples: [
        { japanese: "来月、転勤することになりました。", furigana: "らいげつ、てんきんすることになりました。", english: "It has been decided that I will be transferred next month." },
        { japanese: "明日、会社を休むことになった。", furigana: "あした、かいしゃをやすむことになった。", english: "It turned out that I'll be taking the day off tomorrow." }
      ]},
      { title: "Result/conclusion", examples: [
        { japanese: "結局、行かないことになった。", furigana: "けっきょく、いかないことになった。", english: "It ended up being decided that I wouldn't go." }
      ]}
    ]
  },
  {
    id: "n4-no-ni", level: "N4", pattern: "～のに", title: "Although / despite", short: "Shows a contrast between what is expected and what actually happens.",
    explanation: "～のに connects two facts that are surprising or disappointing when seen together. The first part sets up an expectation, and the second part goes against it. It often carries a feeling of frustration or regret.",
    usages: [
      { title: "Contrary to expectation", examples: [
        { japanese: "もう夜なのに、まだ働いています。", furigana: "もうよるなのに、まだはたらいています。", english: "Even though it's already night, I'm still working." },
        { japanese: "雨なのに、彼は傘を持っていきませんでした。", furigana: "あめなのに、かれはかさをもっていきませんでした。", english: "Even though it was raining, he didn't take an umbrella." }
      ]},
      { title: "With い-adjectives", examples: [
        { japanese: "お金がないのに、高い物を買いました。", furigana: "おかねがないのに、たかいものをかいました。", english: "Even though he has no money, he bought something expensive." }
      ]},
      { title: "With verb plain form", examples: [
        { japanese: "練習したのに、試合に負けました。", furigana: "れんしゅうしたのに、しあいにまけました。", english: "Even though I practiced, I lost the match." }
      ]}
    ], notes: "のに is more emotional than けど; it often implies 'and yet' with a touch of disappointment."
  },
  {
    id: "n4-temo", level: "N4", pattern: "～ても", title: "Even if / even though", short: "Presents a condition that does not change the outcome.",
    explanation: "～ても means that even if the first condition is true, the result in the second part stays the same. It works with verbs, adjectives and nouns.",
    usages: [
      { title: "Verb + ても", examples: [
        { japanese: "明日は雨が降っても、試合をします。", furigana: "あしたはあめがふっても、しあいをします。", english: "Even if it rains tomorrow, we will hold the match." },
        { japanese: "何度失敗しても、諦めません。", furigana: "なんどしっぱいしても、あきらめません。", english: "No matter how many times I fail, I won't give up." }
      ]},
      { title: "Adjective / noun + ても", examples: [
        { japanese: "高くても、買いたいです。", furigana: "たかくても、かいたいです。", english: "Even if it's expensive, I want to buy it." },
        { japanese: "休日でも、働かなければなりません。", furigana: "きゅうじつでも、はたらかなければなりません。", english: "Even on holidays, I have to work." }
      ]}
    ]
  },
  {
    id: "n4-tatoe-temo", level: "N4", pattern: "たとえ～ても", title: "Even if (strong concession)", short: "Stresses that the result holds no matter how extreme the condition.",
    explanation: "たとえ～ても is a stronger, more emphatic version of ～ても. It presents the most extreme or unlikely case first to emphasize that the result will not change.",
    usages: [
      { title: "Emphatic concession", examples: [
        { japanese: "たとえ失敗しても、挑戦する価値はあります。", furigana: "たとえしっぱいしても、ちょうせんするかちはあります。", english: "Even if I fail, it is worth trying." },
        { japanese: "たとえいくら忙しくても、家族の時間は作ります。", furigana: "たとえいくらいそがしくても、かぞくのじかんはつくります。", english: "No matter how busy I am, I will make time for my family." }
      ]}
    ], notes: "たとえ is optional but very common with ても to mark hypothetical extremes."
  },
  {
    id: "n4-bakari-ni", level: "N4", pattern: "～ばかりに", title: "Just because / as a result of", short: "Gives a reason, often for an unfortunate outcome.",
    explanation: "～ばかりに attaches to the plain form of a verb or adjective and gives the reason for a result, usually a negative or unexpected one. The feeling is 'simply because of X, (something bad happened)'.",
    usages: [
      { title: "Reason for a bad result", examples: [
        { japanese: "うるさくしゃべったばかりに、先生に叱られました。", furigana: "うるさくしゃべったばかりに、せんせいにしかられました。", english: "Just because I was talking loudly, I got scolded by the teacher." },
        { japanese: "安いばかりに、品質が悪かった。", furigana: "やすいばかりに、ひんしつがわるかった。", english: "Just because it was cheap, the quality was bad." }
      ]}
    ], notes: "Compare with のに: のに expresses the speaker's surprise at a contrast, while ばかりに focuses on the causal relationship."
  },
  {
    id: "n4-koto-ga-aru", level: "N4", pattern: "～ことがある", title: "Have done / sometimes happens", short: "Expresses past experience, or that something occasionally happens.",
    explanation: "～ことがある has two common uses. With the た-form it asks or states whether someone has ever done something. With the dictionary form it says that something happens from time to time.",
    usages: [
      { title: "Life experience (た-form)", examples: [
        { japanese: "日本へ行ったことがあります。", furigana: "にほんへいったことがあります。", english: "I have been to Japan (before)." },
        { japanese: "富士山に登ったことがありますか。", furigana: "ふじさんにのぼったことがありますか。", english: "Have you ever climbed Mt. Fuji?" }
      ]},
      { title: "Occasional action (dictionary form)", examples: [
        { japanese: "疲れると、朝ご飯を食べないことがあります。", furigana: "つかれると、あさごはんをたべないことがあります。", english: "When I'm tired, I sometimes skip breakfast." }
      ]}
    ]
  },
  {
    id: "n4-garu", level: "N4", pattern: "～がる", title: "Show signs of / feel", short: "Describes an emotion or desire that someone else appears to have.",
    explanation: "～がる attaches to emotion words (痛い → 痛がる, 欲しい → 欲しがる, 嫌 → 嫌がる) and turns them into verbs describing what someone else seems to feel. Japanese avoids directly claiming to know another person's internal feelings.",
    usages: [
      { title: "Someone else's feelings", examples: [
        { japanese: "子供がおもちゃを欲しがっています。", furigana: "こどもがおもちゃをほしがっています。", english: "The child is showing signs of wanting the toy." },
        { japanese: "猫が水を飲みたがっています。", furigana: "ねこがみずをのみたがっています。", english: "The cat wants to drink water." }
      ]},
      { title: "Negative feelings", examples: [
        { japanese: "弟は野菜を嫌がります。", furigana: "おとうとはやさいをいやがります。", english: "My younger brother dislikes vegetables." }
      ]}
    ], notes: "Only use ～がる for other people or animals, not for your own feelings."
  },
  {
    id: "n4-kakeru", level: "N4", pattern: "～かける / ～かけ", title: "Half-done / about to", short: "Says that an action is only partly done, or about to begin.",
    explanation: "～かける attaches to the verb stem to show the action has started but not finished. It can also mean the action is just about to happen. The stem form ～かけ works like a noun.",
    usages: [
      { title: "Half-finished action", examples: [
        { japanese: "食べかけのパンを捨てました。", furigana: "たべかけのパンをすてました。", english: "I threw away the half-eaten bread." },
        { japanese: "書きかけの手紙が机の上にあります。", furigana: "かきかけのてがみがつくえのうえにあります。", english: "There is a half-written letter on the desk." }
      ]},
      { title: "About to happen", examples: [
        { japanese: "寝かけた時に、電話が鳴りました。", furigana: "ねかけたときに、でんわがなりました。", english: "Just as I was about to fall asleep, the phone rang." }
      ]}
    ]
  },
  {
    id: "n4-kimi", level: "N4", pattern: "～気味", title: "Slightly / feel a bit", short: "Says that something is slightly true or that you feel a little of something.",
    explanation: "～気味 attaches to noun or verb stems to indicate a mild tendency or condition, usually one you would rather not have too much of.",
    usages: [
      { title: "Mild condition", examples: [
        { japanese: "少し風邪気味です。", furigana: "すこしかぜぎみです。", english: "I have a bit of a cold." },
        { japanese: "最近、太り気味なので運動しています。", furigana: "さいきん、ふとりぎみなのでうんどうしています。", english: "Lately I've been putting on a bit of weight, so I'm exercising." }
      ]}
    ]
  },
  {
    id: "n4-mama", level: "N4", pattern: "～まま", title: "As it is / without changing", short: "Says that a state stays unchanged while something else happens.",
    explanation: "～まま means 'while still in the state of...' and is used when an action or state continues without the expected change. It can follow the plain form, noun + の, or an adjective.",
    usages: [
      { title: "State continuing", examples: [
        { japanese: "テレビをつけたまま、出かけてしまいました。", furigana: "テレビをつけたまま、でかけてしまいました。", english: "I went out leaving the TV on." },
        { japanese: "窓を開けたまま寝ないでください。", furigana: "まどをあけたままねないでください。", english: "Please don't sleep with the window open." }
      ]},
      { title: "After verb plain form", examples: [
        { japanese: "財布を家に忘れたまま、買い物に行ってしまいました。", furigana: "さいふをいえにわすれたまま、かいものにいってしまいました。", english: "I went shopping having left my wallet at home." }
      ]}
    ]
  },
  {
    id: "n4-furi-wo-suru", level: "N4", pattern: "～ふりをする", title: "Pretend to", short: "Says that someone acts as if something is true when it is not.",
    explanation: "～ふりをする attaches to the plain form of verbs and adjectives to describe pretending. The plain negative form ～ないふりをする is especially common.",
    usages: [
      { title: "Pretending not to notice", examples: [
        { japanese: "知らないふりをしました。", furigana: "しらないふりをしました。", english: "I pretended not to know." },
        { japanese: "彼は聞こえないふりをしていました。", furigana: "かれはきこえないふりをしていました。", english: "He was pretending not to hear." }
      ]}
    ]
  },
  {
    id: "n4-naosu", level: "N4", pattern: "～直す", title: "Redo / do again", short: "Doing an action again, usually to fix or improve it.",
    explanation: "～直す attaches to the stem of a verb to mean 'to do ~ again', typically because the first attempt was wrong or unsatisfactory.",
    usages: [
      { title: "Doing again", examples: [
        { japanese: "間違えたので、もう一度書き直しました。", furigana: "まちがえたので、もういちどかきなおしました。", english: "Because I made a mistake, I rewrote it once more." },
        { japanese: "分からなかったところを説明し直してください。", furigana: "わからなかったところをせつめいしなおしてください。", english: "Please explain again the parts I didn't understand." }
      ]}
    ]
  },
  {
    id: "n4-au", level: "N4", pattern: "～合う", title: "Do together / mutually", short: "Describes an action done by two or more people toward each other.",
    explanation: "～合う attaches to the verb stem and indicates that the action is reciprocal — people do it to each other or together.",
    usages: [
      { title: "Mutual action", examples: [
        { japanese: "困った時はお互いに助け合いましょう。", furigana: "こまったときはおたがいにたすけあいましょう。", english: "When we are in trouble, let's help each other." },
        { japanese: "よく考えてから、意見を話し合います。", furigana: "よくかんがえてから、いけんをはなしあいます。", english: "Let's discuss our opinions after thinking carefully." }
      ]}
    ]
  },
  {
    id: "n4-te-hoshii", level: "N4", pattern: "～てほしい", title: "Want someone to do", short: "Says you want another person to perform an action.",
    explanation: "～てほしい attaches to the て-form of a verb and expresses that the speaker wants someone else to do it. The desired person is usually marked with に.",
    usages: [
      { title: "Asking for behavior", examples: [
        { japanese: "静かにしてほしいです。", furigana: "しずかにしてほしいです。", english: "I want you to be quiet." },
        { japanese: "早く来てほしいです。", furigana: "はやくきてほしいです。", english: "I want you to come early." }
      ]},
      { title: "Third person desire", examples: [
        { japanese: "息子には立派な大人になってほしいです。", furigana: "むすこにはりっぱなおとなになってほしいです。", english: "I want my son to grow up to be a fine adult." }
      ]}
    ]
  },
  {
    id: "n4-tara-dou", level: "N4", pattern: "～たらどうですか / ～たら", title: "Why don't you...?", short: "Offers a suggestion, or asks about a hypothetical outcome.",
    explanation: "～たらどうですか is a common way to suggest that someone try doing something. Plain ～たら can also introduce a hypothetical 'what if' situation.",
    usages: [
      { title: "Suggestion", examples: [
        { japanese: "頭が痛いなら、薬を飲んだらどうですか。", furigana: "あたまがいたいなら、くすりをのんだらどうですか。", english: "If you have a headache, why don't you take some medicine?" },
        { japanese: "一度先生に聞いてみたら？", furigana: "いちどせんせいにきいてみたら？", english: "Why don't you try asking the teacher?" }
      ]},
      { title: "Hypothetical", examples: [
        { japanese: "100万円あったら、何をしますか。", furigana: "ひゃくまんえんあったら、なにをしますか。", english: "If you had a million yen, what would you do?" }
      ]}
    ]
  },
  {
    id: "n4-ba-yokatta", level: "N4", pattern: "～ばよかった", title: "Should have / I wish I had", short: "Expresses regret about a past action that did not happen.",
    explanation: "～ばよかった attaches to the negative ば-form of a verb and expresses that the speaker regrets not doing the action, or wishes the opposite had happened.",
    usages: [
      { title: "Regret about the past", examples: [
        { japanese: "もっと早く起きればよかった。", furigana: "もっとはやくおきればよかった。", english: "I should have woken up earlier." },
        { japanese: "買わなければよかった。", furigana: "かわなければよかった。", english: "I shouldn't have bought it." }
      ]}
    ]
  },
  {
    id: "n4-nakute-sumu", level: "N4", pattern: "～なくて済む", title: "Get by without doing", short: "Says that something can be avoided and the situation is still fine.",
    explanation: "～なくて済む means that you manage or finish something without having to do the action, often conveying relief that an unpleasant thing was unnecessary.",
    usages: [
      { title: "Unnecessary action", examples: [
        { japanese: "幸い、手術しなくて済みました。", furigana: "さいわい、しゅじゅつしなくてすみました。", english: "Fortunately, it ended without needing surgery." },
        { japanese: "ネットで予約すると、並ばなくて済みます。", furigana: "ネットでよやくすると、ならばなくてすみます。", english: "If you book online, you can avoid lining up." }
      ]}
    ], notes: "The formal written variant is ～ずに済む."
  },
  {
    id: "n4-toka", level: "N4", pattern: "～とか", title: "And things like / I heard that", short: "Lists examples vaguely, or reports something heard casually.",
    explanation: "～とか has two uses. Between nouns it lists examples in a casual, incomplete way. At the end of a plain sentence it reports information the speaker heard somewhere.",
    usages: [
      { title: "Vague listing", examples: [
        { japanese: "休みの日は買い物とか映画を見るとかします。", furigana: "やすみのひはかいものとかえいがをみるとかします。", english: "On days off I do things like shopping and watching movies." }
      ]},
      { title: "Casual hearsay", examples: [
        { japanese: "田中さん、来月結婚するんだとか。", furigana: "たなかさん、らいげつけっこんするんだとか。", english: "I heard Tanaka is getting married next month." }
      ]}
    ]
  },
  {
    id: "n4-zutsu", level: "N4", pattern: "～ずつ", title: "Each / a fixed amount at a time", short: "Says that something is done or given in equal portions.",
    explanation: "～ずつ follows numbers, amounts or nouns to show that something is distributed or done little by little, in equal parts, or at regular intervals.",
    usages: [
      { title: "Equal portions", examples: [
        { japanese: "毎日、少しずつ日本語を勉強します。", furigana: "まいにち、すこしずつにほんごをべんきょうします。", english: "I study Japanese a little bit every day." },
        { japanese: "りんごを3人に2個ずつ分けました。", furigana: "りんごをさんにんににこずつわけました。", english: "I divided the apples, two each among three people." }
      ]}
    ]
  },
  {
    id: "n4-hajimeru-owaru", level: "N4", pattern: "～始める / ～終わる / ～続ける", title: "Start / finish / continue doing", short: "Auxiliary verbs showing the beginning, end or continuation of an action.",
    explanation: "～始める, ～終わる, and ～続ける attach to the verb stem and describe the phase of an action. Other auxiliaries like ～やめる and ～かける work the same way.",
    usages: [
      { title: "Beginning", examples: [
        { japanese: "さっき、雨が降り始めました。", furigana: "さっき、あめがふりはじめました。", english: "It started raining a moment ago." }
      ]},
      { title: "Finishing", examples: [
        { japanese: "仕事が終わったら、すぐ帰ります。", furigana: "しごとがおわったら、すぐかえります。", english: "I will go home as soon as work ends." }
      ]},
      { title: "Continuing", examples: [
        { japanese: "体が疲れても、練習を続けました。", furigana: "からだがつかれても、れんしゅうをつづけました。", english: "Even though my body was tired, I continued practicing." }
      ]}
    ]
  },
  {
    id: "n4-wake-dewa-nai", level: "N4", pattern: "～わけではない / ～わけじゃない", title: "It is not that / not necessarily", short: "Partially denies or softens a statement without rejecting it completely.",
    explanation: "～わけではない says that a statement is not entirely true, while leaving room for it to be partly true. It is softer than a straight negative and is very common in explanations.",
    usages: [
      { title: "Partial denial", examples: [
        { japanese: "日本語が嫌いなわけではありません。", furigana: "にほんごがきらいなわけではありません。", english: "It is not that I dislike Japanese." },
        { japanese: "毎日来なければならないわけではありません。", furigana: "まいにちこなければならないわけではありません。", english: "It is not that you have to come every day." }
      ]}
    ]
  },
  // Additional N4 points
  {
    id: "n4-you-to-omou", level: "N4", pattern: "～ようと思う", title: "I think I'll / intend to", short: "Expresses a tentative intention or decision.",
    explanation: "Attaches the volitional form to と思う to express a tentative intention or decision.",
    usages: [
      { title: "Tentative intention", examples: [
        { japanese: "明日は休もうと思います。", furigana: "あしたはやすもうとおもいます。", english: "I think I'll take a day off tomorrow." },
        { japanese: "留学しようと思っていた。", furigana: "りゅうがくしようとおもっていた。", english: "I was thinking about studying abroad." }
      ]}
    ]
  },
  {
    id: "n4-niyoruto", level: "N4", pattern: "～によると／～によれば", title: "According to", short: "Used to cite a source of information.",
    explanation: "Used to attribute information to a source such as news, a person, or a report.",
    usages: [
      { title: "Citing a source", examples: [
        { japanese: "天気予報によると、明日は雨だそうです。", furigana: "てんきよほうによると、あしたはあめだそうです。", english: "According to the weather forecast, it's going to rain tomorrow." },
        { japanese: "新聞によれば、事故があったそうです。", furigana: "しんぶんによれば、じこがあったそうです。", english: "According to the newspaper, there was an accident." }
      ]}
    ]
  },
  // Added: gaps checked against jlptgrammarlist.neocities.org
  {
    id: "n4-potential", level: "N4", pattern: "～られる / ～れる", title: "Potential form (can do)", short: "States that an action is possible for the subject to do.",
    explanation: "The potential form attaches to a verb stem to mean 'can do X'. It looks identical to the passive form for る-verbs, so context decides the meaning.",
    usages: [
      { title: "Ability", examples: [
        { japanese: "私は漢字が読めます。", furigana: "わたしはかんじがよめます。", english: "I can read kanji." },
        { japanese: "この魚は生で食べられる。", furigana: "このさかなはなまでたべられる。", english: "This fish can be eaten raw." }
      ]},
      { title: "Negative inability", examples: [
        { japanese: "今日は行けません。", furigana: "きょうはいけません。", english: "I can't go today." }
      ]}
    ], notes: "For る-verbs, the potential form (食べられる) and the passive form (食べられる) are identical in writing; only context tells them apart. Casual speech often drops ら (ら抜き言葉): 食べれる."
  },
  {
    id: "n4-rashii", level: "N4", pattern: "～らしい", title: "I heard / seems typical of", short: "Reports secondhand information, or says something fits a typical image.",
    explanation: "～らしい attached to a plain form reports something the speaker heard rather than witnessed directly. Attached to a noun, it can also mean 'typical of' (男らしい, 'manly').",
    usages: [
      { title: "Hearsay", examples: [
        { japanese: "天気予報によると、明日は雪らしい。", furigana: "てんきよほうによると、あしたはゆきらしい。", english: "According to the forecast, it's supposed to snow tomorrow." },
        { japanese: "彼はもう帰ったらしいです。", furigana: "かれはもうかえったらしいです。", english: "I heard he already went home." }
      ]},
      { title: "Typical of", examples: [
        { japanese: "今日は春らしい天気です。", furigana: "きょうははるらしいてんきです。", english: "Today's weather is typical of spring." }
      ]}
    ], notes: "Compare with N4 ～そうだ（伝聞）: そうだ reports information exactly as heard, while らしい adds a slight sense of the speaker's own inference."
  },
  {
    id: "n4-hitsuyou-ga-aru", level: "N4", pattern: "～必要がある", title: "Need to / it is necessary to", short: "States that an action is required.",
    explanation: "～必要がある attaches to the dictionary form of a verb to state that doing it is necessary, often in a more objective or formal tone than ～なければならない.",
    usages: [
      { title: "Stating necessity", examples: [
        { japanese: "毎日薬を飲む必要があります。", furigana: "まいにちくすりをのむひつようがあります。", english: "It is necessary to take the medicine every day." },
        { japanese: "この書類にサインする必要はありません。", furigana: "このしょるいにサインするひつようはありません。", english: "There's no need to sign this document." }
      ]}
    ]
  },
  // Added: gaps checked against jlptgrammarlist.neocities.org (N4 deep-dive pass)
  {
    id: "n4-okini", level: "N4", pattern: "～おきに", title: "Every / At intervals of", short: "Something happens repeatedly, with a fixed gap between occurrences.",
    explanation: "～おきに attaches to a number and counter to mean 'every X' or 'at intervals of X', describing regular repetition.",
    usages: [
      { title: "Regular interval", examples: [
        { japanese: "このバスは十分おきに来ます。", furigana: "このバスはじゅっぷんおきにきます。", english: "This bus comes every ten minutes." },
        { japanese: "一日おきに運動しています。", furigana: "いちにちおきにうんどうしています。", english: "I exercise every other day." }
      ]}
    ], notes: "一日おきに means 'every other day' (with a day skipped between), not literally 'every day' — be careful with the counting."
  },
  {
    id: "n4-ga-suru", level: "N4", pattern: "～がする", title: "There is a sense of (smell, sound, taste, feeling)", short: "Describes a sensory impression the speaker perceives, without a clear source.",
    explanation: "～がする follows a sensory noun (匂い, 音, 味, 気) to describe a smell, sound, taste, or feeling the speaker is experiencing.",
    usages: [
      { title: "Sensory impression", examples: [
        { japanese: "何か焦げた匂いがします。", furigana: "なにかこげたにおいがします。", english: "There's a smell of something burning." },
        { japanese: "隣の部屋から変な音がした。", furigana: "となりのへやからへんなおとがした。", english: "A strange sound came from the room next door." }
      ]}
    ]
  },
  {
    id: "n4-koto-nominalizer", level: "N4", pattern: "～こと", title: "Turning a verb into a noun (nominalizer)", short: "Attaches to a verb so it can be used as the subject or object of a sentence.",
    explanation: "Attaching こと to the dictionary form of a verb turns the whole action into a noun, allowing it to be the topic, subject, or object of a sentence.",
    usages: [
      { title: "Verb as a noun", examples: [
        { japanese: "私の趣味は本を読むことです。", furigana: "わたしのしゅみはほんをよむことです。", english: "My hobby is reading books." },
        { japanese: "早起きすることは体にいいです。", furigana: "はやおきすることはからだにいいです。", english: "Getting up early is good for your health." }
      ]}
    ], notes: "の can often replace こと for this purpose (本を読むのが好きです), but こと is required before です and certain verbs like 決める and 伝える."
  },
  {
    id: "n4-goro", level: "N4", pattern: "～ごろ", title: "Around / About (a point in time)", short: "Gives an approximate point in time, like a clock time or date.",
    explanation: "～ごろ attaches to a specific point in time (a clock time, a date, an age) to mean 'around' or 'about' that time.",
    usages: [
      { title: "Approximate time", examples: [
        { japanese: "七時ごろ、家に着きます。", furigana: "しちじごろ、いえにつきます。", english: "I'll get home around 7 o'clock." },
        { japanese: "三十歳ごろ、日本に住んでいました。", furigana: "さんじゅっさいごろ、にほんにすんでいました。", english: "Around the age of 30, I was living in Japan." }
      ]}
    ], notes: "ごろ is for a point in time (around 7 o'clock); くらい/ぐらい is for an amount or duration (about 7 minutes) — the two aren't interchangeable."
  },
  {
    id: "n4-sa-nominalizer", level: "N4", pattern: "～さ", title: "Turning an adjective into a noun", short: "Attaches to an adjective stem to make a noun measuring that quality.",
    explanation: "～さ attaches to the stem of an い-adjective (or な-adjective) to turn the quality itself into a measurable noun, like 'height' from 'tall'.",
    usages: [
      { title: "Adjective to noun", examples: [
        { japanese: "この山の高さはどのくらいですか。", furigana: "このやまのたかさはどのくらいですか。", english: "How tall is this mountain?" },
        { japanese: "彼の優しさに感謝しています。", furigana: "かれのやさしさにかんしゃしています。", english: "I'm grateful for his kindness." }
      ]}
    ]
  },
  {
    id: "n4-shi", level: "N4", pattern: "～し", title: "And, what's more / Because (listing reasons)", short: "Lists two or more facts or reasons that together support a conclusion.",
    explanation: "～し attaches to the plain form of a verb or adjective to list facts or reasons side by side, implying there are more that could be added, and often building toward a conclusion.",
    usages: [
      { title: "Listing reasons", examples: [
        { japanese: "このアパートは駅から近いし、家賃も安いし、とても気に入っています。", furigana: "このアパートはえきからちかいし、やちんもやすいし、とてもきにいっています。", english: "This apartment is close to the station, and the rent is cheap too, so I really like it." },
        { japanese: "今日は疲れたし、もう寝ます。", furigana: "きょうはつかれたし、もうねます。", english: "I'm tired today, so I'm going to bed now." }
      ]}
    ]
  },
  {
    id: "n4-janaika", level: "N4", pattern: "～じゃないか", title: "Isn't it? / Right?", short: "Casually points out something the speaker finds obvious, surprising, or wants to confirm.",
    explanation: "～じゃないか (casual, from ～ではないか) points out something the speaker finds obvious or wants the listener to notice or agree with.",
    usages: [
      { title: "Pointing something out", examples: [
        { japanese: "あれ、電気がついているじゃないか。", furigana: "あれ、でんきがついているじゃないか。", english: "Hey, the light is on, isn't it!" },
        { japanese: "結構上手じゃないか。", furigana: "けっこうじょうずじゃないか。", english: "You're actually pretty good at this, aren't you?" }
      ]}
    ]
  },
  {
    id: "n4-soredemo", level: "N4", pattern: "それでも", title: "Even so / Still", short: "Acknowledges a fact but says the situation doesn't change because of it.",
    explanation: "それでも starts a new sentence acknowledging what was just said, then states that it doesn't change the outcome, similar to 'even so' or 'still'.",
    usages: [
      { title: "Unchanged outcome", examples: [
        { japanese: "何度も失敗した。それでも、彼は諦めなかった。", furigana: "なんどもしっぱいした。それでも、かれはあきらめなかった。", english: "He failed many times. Even so, he didn't give up." }
      ]}
    ]
  },
  {
    id: "n4-dakede", level: "N4", pattern: "～だけで", title: "Just by / Simply with", short: "A minimal action or amount is all that's needed to bring about a result.",
    explanation: "～だけで attaches to a noun or dictionary-form verb and means that just this alone is enough to cause the following result, without needing anything more.",
    usages: [
      { title: "Minimal cause", examples: [
        { japanese: "彼の顔を見るだけで、元気になります。", furigana: "かれのかおをみるだけで、げんきになります。", english: "Just seeing his face is enough to cheer me up." },
        { japanese: "少し歩いただけで、疲れてしまった。", furigana: "すこしあるいただけで、つかれてしまった。", english: "Just from walking a little, I got tired." }
      ]}
    ]
  },
  {
    id: "n4-dasu", level: "N4", pattern: "～出す", title: "Start suddenly / Begin to", short: "An action or state begins abruptly, often without warning.",
    explanation: "～出す attaches to the ます-stem of a verb to mean the action started suddenly, often unexpectedly (泣き出す, 降り出す).",
    usages: [
      { title: "Sudden start", examples: [
        { japanese: "赤ちゃんが急に泣き出した。", furigana: "あかちゃんがきゅうになきだした。", english: "The baby suddenly started crying." },
        { japanese: "空が暗くなり、雨が降り出した。", furigana: "そらがくらくなり、あめがふりだした。", english: "The sky grew dark, and it started to rain." }
      ]}
    ]
  },
  {
    id: "n4-tearu", level: "N4", pattern: "～てある", title: "Has been done (resulting state)", short: "Describes the lasting result of someone's intentional action, like a prepared state.",
    explanation: "～てある attaches to the て-form of a transitive verb to describe an object left in a state that resulted from someone's intentional action — it emphasizes the resulting state, not who did it.",
    usages: [
      { title: "Resulting state", examples: [
        { japanese: "窓が開けてあります。", furigana: "まどがあけてあります。", english: "The window has been left open (someone opened it on purpose)." },
        { japanese: "テーブルの上に料理が並べてある。", furigana: "テーブルのうえにりょうりがならべてある。", english: "The food has been laid out on the table." }
      ]}
    ], notes: "Compare with ～ている: ドアが開いている just describes the door being open, with no focus on who opened it or why; ドアが開けてある implies someone opened it on purpose and it's still that way."
  },
  {
    id: "n4-tesumimasen", level: "N4", pattern: "～てすみません", title: "Sorry for doing", short: "Apologizes for a specific action the speaker took or failed to take.",
    explanation: "～てすみません attaches to the て-form of a verb to apologize specifically for that action, similar to 'sorry for doing X'.",
    usages: [
      { title: "Apologizing for an action", examples: [
        { japanese: "遅くなってすみません。", furigana: "おそくなってすみません。", english: "Sorry for being late." },
        { japanese: "何も知らないで質問してすみません。", furigana: "なにもしらないでしつもんしてすみません。", english: "Sorry for asking without knowing anything." }
      ]}
    ]
  },
  {
    id: "n4-demo-example", level: "N4", pattern: "～でも", title: "Or something / Something like", short: "Casually suggests one example among several possible options.",
    explanation: "～でも follows a noun to casually suggest it as one possible example, similar to 'or something' — it softens the suggestion, leaving room for other options.",
    usages: [
      { title: "Casual suggestion", examples: [
        { japanese: "お茶でも飲みませんか。", furigana: "おちゃでものみませんか。", english: "Would you like some tea or something?" },
        { japanese: "疲れた時は、音楽でも聞いてリラックスします。", furigana: "つかれたときは、おんがくでもきいてリラックスします。", english: "When I'm tired, I relax by listening to music or something like that." }
      ]}
    ]
  },
  {
    id: "n4-teyokatta", level: "N4", pattern: "～てよかった", title: "I'm glad that", short: "Expresses relief or satisfaction about something that happened.",
    explanation: "～てよかった attaches to the て-form of a verb to express relief or happiness that something happened (or didn't happen).",
    usages: [
      { title: "Relief or satisfaction", examples: [
        { japanese: "無事に着いてよかったです。", furigana: "ぶじについてよかったです。", english: "I'm glad we arrived safely." },
        { japanese: "あなたに会えてよかった。", furigana: "あなたにあえてよかった。", english: "I'm glad I got to meet you." }
      ]}
    ]
  },
  {
    id: "n4-naide", level: "N4", pattern: "～ないで", title: "Without doing", short: "One action happens in place of, or without, another action taking place.",
    explanation: "～ないで attaches to the negative stem of a verb to mean 'without doing X', describing an action carried out in the absence of another.",
    usages: [
      { title: "Doing something without another action", examples: [
        { japanese: "朝ご飯を食べないで、学校に行きました。", furigana: "あさごはんをたべないで、がっこうにいきました。", english: "I went to school without eating breakfast." },
        { japanese: "傘を持たないで出かけて、雨に降られた。", furigana: "かさをもたないででかけて、あめにふられた。", english: "I went out without an umbrella and got caught in the rain." }
      ]}
    ], notes: "Don't confuse with ～なくて, which gives a reason or simply connects a negative fact rather than describing an accompanying circumstance."
  },
  {
    id: "n4-nakutewa", level: "N4", pattern: "～なくては", title: "Must / Have to (alternate form)", short: "Another common way to conjugate the negative obligation pattern.",
    explanation: "～なくては is another common conjugation for stating obligation (a shortened form of ～なくてはいけない/ならない), meaning essentially the same as ～なければならない.",
    usages: [
      { title: "Stating obligation", examples: [
        { japanese: "もう帰らなくては。", furigana: "もうかえらなくては。", english: "I really have to get going now." },
        { japanese: "明日までにレポートを出さなくてはいけません。", furigana: "あしたまでにレポートをださなくてはいけません。", english: "I have to turn in the report by tomorrow." }
      ]}
    ], notes: "In casual speech, なくては is often shortened further to なくちゃ."
  },
  {
    id: "n4-nado", level: "N4", pattern: "～など", title: "Such as / Etc.", short: "Lists one or two examples from a larger, unstated category.",
    explanation: "～など follows one or more nouns to give them as examples from a larger category, similar to 'such as' or 'etc.' in English.",
    usages: [
      { title: "Giving examples", examples: [
        { japanese: "りんごやバナナなどの果物が好きです。", furigana: "りんごやバナナなどのくだものがすきです。", english: "I like fruits such as apples and bananas." }
      ]}
    ]
  },
  {
    id: "n4-nonakade", level: "N4", pattern: "～の中で", title: "Among / Out of", short: "Sets the scope for a superlative or comparative statement.",
    explanation: "～の中で follows a noun describing a group or category and sets the scope for a comparison or superlative that follows, meaning 'among X' or 'out of X'.",
    usages: [
      { title: "Scope for comparison", examples: [
        { japanese: "この店の中で、これが一番人気です。", furigana: "このみせのなかで、これがいちばんにんきです。", english: "Among the items in this shop, this one is the most popular." }
      ]}
    ]
  },
  {
    id: "n4-baaiwa", level: "N4", pattern: "～場合は", title: "In the case of / If", short: "Sets up a specific scenario and explains what applies in that case.",
    explanation: "～場合は attaches to a noun + の or a plain-form verb to introduce a specific scenario, then explains what happens or what to do in that case.",
    usages: [
      { title: "Setting a scenario", examples: [
        { japanese: "雨の場合は、イベントは中止になります。", furigana: "あめのばあいは、イベントはちゅうしになります。", english: "In the case of rain, the event will be cancelled." },
        { japanese: "分からない場合は、係員にお尋ねください。", furigana: "わからないばあいは、かかりいんにおたずねください。", english: "If you don't understand, please ask a staff member." }
      ]}
    ]
  },
  {
    id: "n4-madeni", level: "N4", pattern: "～までに", title: "By (a deadline)", short: "Marks the latest point by which an action must be completed.",
    explanation: "～までに attaches to a time expression to mark a deadline — the action must happen at some point before or by that time, not continuously up until it.",
    usages: [
      { title: "Deadline", examples: [
        { japanese: "金曜日までにレポートを提出してください。", furigana: "きんようびまでにレポートをていしゅつしてください。", english: "Please submit the report by Friday." },
        { japanese: "十時までに帰ってきます。", furigana: "じゅうじまでにかえってきます。", english: "I will be back by 10 o'clock." }
      ]}
    ], notes: "まで (without に) means 'until', describing a continuous action up to that point (十時まで働きます, 'I'll work until 10'); までに marks a one-time deadline before that point."
  },
  {
    id: "n4-younisuru", level: "N4", pattern: "～ようにする", title: "Try to make it so / Make an effort to", short: "The speaker makes a deliberate, ongoing effort to establish a habit or condition.",
    explanation: "～ようにする attaches to the dictionary or negative form of a verb and describes making a conscious, ongoing effort to bring about or maintain a habit.",
    usages: [
      { title: "Deliberate effort", examples: [
        { japanese: "毎日野菜を食べるようにしています。", furigana: "まいにちやさいをたべるようにしています。", english: "I make an effort to eat vegetables every day." },
        { japanese: "遅刻しないようにしてください。", furigana: "ちこくしないようにしてください。", english: "Please make an effort not to be late." }
      ]}
    ], notes: "Compare with ようになる, which describes a change that happens naturally or as a result of ability, not a deliberate ongoing effort."
  }
];

const N3_GRAMMAR = [
  {
    id: "n3-uuchi-ni", level: "N3", pattern: "～うちに", title: "While / before a change occurs", short: "Perform an action while a specific state continues, before it changes.",
    explanation: "～うちに attaches to a plain-form phrase and means 'while X is still the case' — the action described needs to happen before that window of opportunity closes. It's often used with states that won't last forever (being young, having free time, food being warm), giving a gentle sense of urgency.",
    usages: [
      { title: "While a state holds", examples: [
        { japanese: "温かいうちに食べてください。", furigana: "あたたかいうちにたべてください。", english: "Please eat while it is warm." },
        { japanese: "若いうちにいろいろな経験をしたほうがいい。", furigana: "わかいうちにいろいろなけいけんをしたほうがいい。", english: "You should have various experiences while you're young." },
        { japanese: "熱いうちに食べてください。", furigana: "あついうちにたべてください。", english: "Please eat it while it's still hot." }
      ]},
      { title: "Before a change", examples: [
        { japanese: "暗くならないうちに帰りましょう。", furigana: "くらくならないうちにかえりましょう。", english: "Let's go home before it gets dark." }
      ]}
    ]
  },
  {
    id: "n3-aida-aidani", level: "N3", pattern: "～あいだ / ～あいだに", title: "While / during", short: "あいだ spans the entire duration; あいだに marks a single point in that duration.",
    explanation: "～あいだ describes an action or state that continues throughout an entire span of time, while ～あいだに marks a shorter action happening at some point within that span — 'while X' (throughout) versus 'while X' (at some point during). あいだ can also mark a spatial 'between', a related but distinct sense sharing the same word.",
    usages: [
      { title: "Entire duration (あいだ)", examples: [
        { japanese: "子供が寝ている間、本を読んでいました。", furigana: "こどもがねているあいだ、ほんをよんでいました。", english: "I read a book the whole time the child was sleeping." },
        { japanese: "夏の間、田舎で過ごした。", furigana: "なつのあいだ、いなかですごした。", english: "I spent the whole summer in the countryside." },
        { japanese: "彼が話しているあいだ、誰も口を挟まなかった。", furigana: "かれがはなしているあいだ、だれもくちをはさまなかった。", english: "While he was speaking, no one interrupted." }
      ]},
      { title: "Moment within duration (あいだに)", examples: [
        { japanese: "留守の間に泥棒が入りました。", furigana: "るすのあいだにどろぼうがはいりました。", english: "A burglar broke in while I was away." }
      ]},
      { title: "Spatial \"between\"", examples: [
        { japanese: "木と木の間にロープを張った。", furigana: "きときのあいだにロープをはった。", english: "I stretched a rope between the trees." }
      ]}
    ]
  },
  {
    id: "n3-totte", level: "N3", pattern: "～にとって", title: "To / for / from the perspective of", short: "States an evaluation or opinion from a specific perspective.",
    explanation: "～にとって follows a noun (usually a person or group) and frames a following judgment or statement from that party's specific point of view — 'for X' or 'from X's perspective'. It only works with evaluative statements (important, difficult, meaningful); it can't be used for physical actions someone performs.",
    usages: [
      { title: "Perspective", examples: [
        { japanese: "私にとって、この写真は大切です。", furigana: "わたしにとって、このしゃしんはたいせつです。", english: "To me, this picture is precious." },
        { japanese: "学生にとって、この辞書は役に立つ。", furigana: "がくせいにとって、このじしょはやくにたつ。", english: "For students, this dictionary is useful." },
        { japanese: "子供にとって、遊びはとても大切だ。", furigana: "こどもにとって、あそびはとてもたいせつだ。", english: "For children, play is very important." }
      ]}
    ]
  },
  {
    id: "n3-nitsuite", level: "N3", pattern: "～について", title: "About / regarding", short: "Introduces the topic or subject matter of an action.",
    explanation: "～について follows a noun and marks it as the topic being discussed, researched, or explained — 'about X' or 'concerning X'. It's one of the most common topic-marking expressions in both spoken and written Japanese.",
    usages: [
      { title: "Topic of conversation", examples: [
        { japanese: "日本の文化について調べています。", furigana: "にほんのぶんかについてしらべています。", english: "I am researching Japanese culture." },
        { japanese: "このテーマについてレポートを書きます。", furigana: "このテーマについてレポートをかきます。", english: "I will write a report about this theme." },
        { japanese: "この本は日本の歴史について書かれている。", furigana: "このほんはにほんのれきしについてかかれている。", english: "This book is written about Japanese history." }
      ]}
    ]
  },
  {
    id: "n3-nikanshi", level: "N3", pattern: "～に関して", title: "Regarding / in relation to", short: "A more formal version of ～について.",
    explanation: "～に関して is a more formal equivalent of ～について, meaning 'regarding X' or 'in relation to X'. It's common in business writing, academic papers, and formal announcements where について might feel slightly too casual.",
    usages: [
      { title: "Formal topic", examples: [
        { japanese: "この問題に関して、ご意見はありませんか。", furigana: "このもんだいにかんして、ごいけんはありませんか。", english: "Do you have any opinions regarding this issue?" },
        { japanese: "今後の方針に関して話し合いたい。", furigana: "こんごのほうしんにかんしてはなしあいたい。", english: "I would like to discuss the future policy." },
        { japanese: "今後の予定に関して、詳しくご説明します。", furigana: "こんごのよていにかんして、くわしくごせつめいします。", english: "I will explain the upcoming schedule in detail." }
      ]}
    ]
  },
  {
    id: "n3-niyotte", level: "N3", pattern: "～によって", title: "By / depending on / due to", short: "Expresses method, cause, agent in passive structures, or variation.",
    explanation: "～によって has three related uses: marking the agent of a passive action in formal writing (この小説は夏目漱石によって書かれた, 'this novel was written by Natsume Soseki'), marking a means or method ('by means of X'), and marking a varying factor that a result depends on ('depending on X').",
    usages: [
      { title: "Depending on", examples: [
        { japanese: "人によって考え方が違います。", furigana: "ひとによってかんがえかたがちがいます。", english: "Ways of thinking differ depending on the person." },
        { japanese: "人によって、意見は違う。", furigana: "ひとによって、いけんはちがう。", english: "Opinions differ depending on the person." }
      ]},
      { title: "Due to / Cause", examples: [
        { japanese: "台風によって電車が止まりました。", furigana: "たいふうによってでんしゃがとまりました。", english: "The trains stopped due to the typhoon." }
      ]},
      { title: "Agent in passive", examples: [
        { japanese: "この絵は、有名な画家によって描かれた。", furigana: "このえは、ゆうめいながかによってえがかれた。", english: "This painting was painted by a famous artist." }
      ]}
    ]
  },
  {
    id: "n3-tazoroe-tatottoshite", level: "N3", pattern: "～として", title: "As / in the capacity of", short: "States a role, title, status, or category.",
    explanation: "～として follows a noun and marks the role, capacity, or category something is being considered in — 'as X' or 'in the capacity of X'. It's used both for people (acting in a professional role) and for abstract categories (counted as an example of something).",
    usages: [
      { title: "Role or capacity", examples: [
        { japanese: "彼は留学生として日本に来ました。", furigana: "かれはりゅうがくせいとしてにほんにきました。", english: "He came to Japan as an exchange student." },
        { japanese: "代表として会議に出席した。", furigana: "だいひょうとしてかいぎにしゅっせきした。", english: "I attended the meeting as a representative." },
        { japanese: "彼は通訳として、会議に参加した。", furigana: "かれはつうやくとして、かいぎにさんかした。", english: "He participated in the meeting as an interpreter." }
      ]}
    ]
  },
  {
    id: "n3-warini", level: "N3", pattern: "～わりに（は）", title: "Considering that / given that", short: "Expresses a outcome that unexpected given the premise.",
    explanation: "～わりに（は）connects a premise to a surprising reality that diverges from what the premise alone would predict — the outcome is disproportionately better or worse than expected, given the baseline. It's commonly used to comment on price, effort, or experience relative to results.",
    usages: [
      { title: "Unexpected outcome", examples: [
        { japanese: "この料理は値段のわりに美味しいです。", furigana: "このりょうりはねだんのわりにおいしいです。", english: "This dish is delicious considering the price." },
        { japanese: "たくさん食べたわりに、太っていない。", furigana: "たくさんたべたわりに、ふとっていない。", english: "Considering how much I ate, I haven't gained weight." },
        { japanese: "値段が高いわりに、あまり美味しくなかった。", furigana: "ねだんがたかいわりに、あまりおいしくなかった。", english: "Considering how expensive it was, it wasn't very tasty." }
      ]}
    ]
  },
  {
    id: "n3-kuse-ni", level: "N3", pattern: "～くせに", title: "Even though / and yet (blame)", short: "Expresses criticism or annoyance that something occurs despite a fact.",
    explanation: "～くせに attaches to a plain-form phrase and criticizes a contradiction between a fact and someone's behavior — 'even though X, they act like Y', with a clearly disapproving, sometimes contemptuous tone. It's always critical; unlike のに, it can never be used sympathetically.",
    usages: [
      { title: "Criticism", examples: [
        { japanese: "知っているくせに、教えてくれません。", furigana: "しっているくせに、おしえてくれません。", english: "Even though he knows, he won't tell me." },
        { japanese: "子供のくせに、大人のような口調で話す。", furigana: "こどものくせに、おとなのようなくちょうではなす。", english: "Despite being a child, he speaks in an adult tone." },
        { japanese: "下手なくせに、彼はいつも自信満々だ。", furigana: "へたなくせに、かれはいつもじしんまんまんだ。", english: "Even though he's bad at it, he's always brimming with confidence." }
      ]}
    ]
  },
  {
    id: "n3-sei-de", level: "N3", pattern: "～せいで / ～せいか", title: "Because of / fault of", short: "Assigns blame to something for a negative outcome.",
    explanation: "～せいで attributes a negative outcome to a specific cause or person's fault — 'because of X (which is to blame)'. ～せいか softens this into a guess: 'maybe because of X' — the speaker isn't fully certain X is really the cause, just suspects it might be.",
    usages: [
      { title: "Assigning blame", examples: [
        { japanese: "事故のせいで遅刻しました。", furigana: "じこのせいでちこくしました。", english: "I was late because of an accident." },
        { japanese: "疲れのせいか、頭が痛い。", furigana: "つかれのせいか、あたまがいたい。", english: "Perhaps because of fatigue, I have a headache." },
        { japanese: "寝不足のせいか、頭がぼんやりする。", furigana: "ねぶそくのせいか、あたまがぼんやりする。", english: "Maybe because of lack of sleep, my head feels foggy." }
      ]}
    ]
  },
  {
    id: "n3-okage-de", level: "N3", pattern: "～おかげで", title: "Thanks to / because of", short: "Gives credit to something for a positive outcome.",
    explanation: "～おかげで attributes a positive outcome to a helpful cause or person — 'thanks to X'. It can also be used sarcastically for a negative outcome, implying mock gratitude for something that actually caused trouble.",
    usages: [
      { title: "Expressing gratitude", examples: [
        { japanese: "先生のおかげで試験に合格しました。", furigana: "せんせいのおかげでしけんにごうかくしました。", english: "Thanks to my teacher, I passed the exam." },
        { japanese: "雨のおかげで、作物がよく育った。", furigana: "あめのおかげで、さくもつがよくそだった。", english: "Thanks to the rain, the crops grew well." },
        { japanese: "先生のおかげで、試験に合格できました。", furigana: "せんせいのおかげで、しけんにごうかくできました。", english: "Thanks to my teacher, I was able to pass the exam." }
      ]}
    ]
  },
  {
    id: "n3-touri-ni", level: "N3", pattern: "～とおりに / ～通りに", title: "Just as / in accordance with", short: "Shows doing an action exactly as instructed, planned, or seen.",
    explanation: "～とおりに follows a noun + の or the dictionary/past form of a verb, meaning 'exactly as X' or 'in the way that X' — the outcome matches a plan, instruction, or expectation precisely, with no deviation.",
    usages: [
      { title: "Following instructions", examples: [
        { japanese: "私が言う通りに書いてください。", furigana: "わたしがいうとおりにかいてください。", english: "Please write it down exactly as I say." },
        { japanese: "予定通りに進んでいます。", furigana: "よていどおりにすすんでいます。", english: "It's progressing as planned." },
        { japanese: "レシピのとおりに作ったら、美味しくできた。", furigana: "レシピのとおりにつくったら、おいしくできた。", english: "When I made it exactly as the recipe said, it turned out delicious." }
      ]}
    ]
  },
  {
    id: "n3-tatotan-ni", level: "N3", pattern: "～たとたん（に）", title: "Just as / the moment that", short: "An unexpected event happens immediately after an action.",
    explanation: "～たとたん（に）attaches to the past-tense form of a verb and means 'the moment X happened' — the second event follows immediately and often unexpectedly, usually with a note of surprise at how quickly it happened.",
    usages: [
      { title: "Sudden secondary event", examples: [
        { japanese: "家を出たとたんに雨が降り出しました。", furigana: "いえをでたとたんにあめがふりだしました。", english: "Just as I left the house, it started to rain." },
        { japanese: "ドアを開けたとたん、猫が飛び出した。", furigana: "ドアをあけたとたん、ねこがとびだした。", english: "The moment I opened the door, the cat jumped out." },
        { japanese: "家を出たとたん、雨が降り出した。", furigana: "いえをでたとたん、あめがふりだした。", english: "The moment I left the house, it started raining." }
      ]}
    ]
  },
  {
    id: "n3-tabakari", level: "N3", pattern: "～たばかり", title: "Just finished / just did", short: "Expresses that an action was completed very recently in the speaker's mind.",
    explanation: "～たばかり attaches to the past-tense form of a verb and means 'just finished doing X' — emphasizing that very little time has passed since the action was completed, often used to explain why something isn't ready yet or why a state is still fresh.",
    usages: [
      { title: "Recent completion", examples: [
        { japanese: "先月、日本に来たばかりです。", furigana: "せんげつ、にほんにきたばかりです。", english: "I just arrived in Japan last month." },
        { japanese: "食べたばかりなのに、もうお腹が空いた。", furigana: "たべたばかりなのに、もうおなかがすいた。", english: "I just ate, but I'm already hungry." },
        { japanese: "この店は先月オープンしたばかりだ。", furigana: "このみせはせんげつオープンしたばかりだ。", english: "This shop just opened last month." }
      ]}
    ]
  },
  {
    id: "n3-bakari", level: "N3", pattern: "～ばかり", title: "Nothing but / only", short: "Indicates that someone does or uses only one thing repeatedly.",
    explanation: "～ばかり attaches to a noun or the て-form of a verb and means someone does nothing but that one thing — 'only' or 'nothing but', often with a critical tone suggesting an unbalanced habit (テレビばかり見ている, 'does nothing but watch TV').",
    usages: [
      { title: "Exclusive action", examples: [
        { japanese: "ゲームばかりしていないで、勉強しなさい。", furigana: "ゲームばかりしていないで、べんきょうしなさい。", english: "Stop playing games all the time and study." },
        { japanese: "彼は文句ばかり言っている。", furigana: "かれはもんくばかりいっている。", english: "He's always complaining." },
        { japanese: "妹は最近、甘いものばかり食べている。", furigana: "いもうとはさいきん、あまいものばかりたべている。", english: "My younger sister has been eating nothing but sweets lately." }
      ]}
    ]
  },
  {
    id: "n3-naraku", level: "N3", pattern: "～非 / ～無 / ～不 / ～未", title: "Prefixes of Negation", short: "Prefixes attached to nouns to alter meaning to 'un-', 'non-', or 'not yet'.",
    explanation: "非, 無, 不, and 未 are all formal prefixes that negate the noun they attach to, though each has a slightly different flavor. 非 marks something as simply not fitting a category (非常識, 'lacking common sense'); 無 means a total absence (無関心, 'indifference'); 不 marks a negative or undesirable state (不便, 'inconvenient'); and 未 means 'not yet' (未経験, 'inexperienced', literally 'not-yet-experienced').",
    usages: [
      { title: "Prefix usage", examples: [
        { japanese: "未完成の作品です。", furigana: "みかんせいのさくひんです。", english: "It is an incomplete work." },
        { japanese: "不満がある。", furigana: "ふまんがある。", english: "I have dissatisfaction." },
        { japanese: "無意識にやってしまった。", furigana: "むいしきにやってしまった。", english: "I did it unconsciously." },
        { japanese: "この製品はまだ未完成だ。", furigana: "このせいひんはまだみかんせいだ。", english: "This product is still unfinished." }
      ]}
    ]
  },
  {
    id: "n3-ka-dou-ka", level: "N3", pattern: "～かどうか", title: "Whether or not", short: "Embeds a yes/no question into a longer sentence.",
    explanation: "～かどうか attaches to a plain-form phrase and turns it into an embedded yes/no question, meaning 'whether or not X' — used when the truth of something is uncertain and needs to be checked, decided, or reported on.",
    usages: [
      { title: "Embedded question", examples: [
        { japanese: "明日行けるかどうか分かりません。", furigana: "あしたいけるかどうかわかりません。", english: "I don't know whether or not I can go tomorrow." },
        { japanese: "これでいいかどうか確かめてください。", furigana: "これでいいかどうかたしかめてください。", english: "Please check whether this is okay." },
        { japanese: "彼が来るかどうか、まだ分からない。", furigana: "かれがくるかどうか、まだわからない。", english: "I still don't know whether he's coming or not." }
      ]}
    ]
  },
  {
    id: "n3-tame-reason", level: "N3", pattern: "～ために（原因）", title: "Because of / due to", short: "States a formal cause or reason for a result.",
    explanation: "～ため（に）can mark a reason as well as a purpose. When following a state or fact rather than an intentional action, it means 'because of X' — a formal, slightly written-register equivalent of から or ので, common in explanations and news reports.",
    usages: [
      { title: "Formal reason", examples: [
        { japanese: "大雨のために、試合は中止になりました。", furigana: "おおあめのために、しあいはちゅうしになりました。", english: "Due to heavy rain, the match was canceled." },
        { japanese: "病気のために学校を休んだ。", furigana: "びょうきのためにがっこうをやすんだ。", english: "I was absent from school due to illness." },
        { japanese: "大雪のため、電車が運休している。", furigana: "おおゆきのため、でんしゃがうんきゅうしている。", english: "Trains are suspended because of the heavy snow." }
      ]}
    ]
  },
  {
    id: "n3-osore-ga-aru", level: "N3", pattern: "～おそれがある", title: "There is a risk that / fear that", short: "Used in news or formal warnings for potential negative events.",
    explanation: "～おそれがある follows a noun or dictionary-form verb and warns of a possible negative outcome — 'there is a risk that X'. It's a formal expression common in weather warnings, safety notices, and news reports about potential dangers.",
    usages: [
      { title: "Formal warning", examples: [
        { japanese: "台風が上陸するおそれがあります。", furigana: "たいふうがじょうりくするおそれがあります。", english: "There is a danger that the typhoon will make landfall." },
        { japanese: "火災が発生するおそれがある。", furigana: "かさいがはっせいするおそれがある。", english: "There is a risk of fire breaking out." },
        { japanese: "この薬には副作用のおそれがある。", furigana: "このくすりにはふくさようのおそれがある。", english: "There is a risk of side effects with this medicine." }
      ]}
    ]
  },
  {
    id: "n3-ni-chigainai", level: "N3", pattern: "～に違いない", title: "Must be / bound to be", short: "Expresses strong logical certainty or conviction by the speaker.",
    explanation: "～に違いない attaches to a plain-form phrase and expresses strong personal conviction, based on available evidence, that something must be true — 'it must be X'. It's more confident than かもしれない but still short of stating something as an established fact.",
    usages: [
      { title: "Strong deduction", examples: [
        { japanese: "犯人は彼に違いない。", furigana: "はんにんはかれにちがいない。", english: "The culprit must be him." },
        { japanese: "彼女は美人に違いない。", furigana: "かのじょはびじんにちがいない。", english: "She must be beautiful." },
        { japanese: "この写真の様子から見て、楽しいパーティーだったに違いない。", furigana: "このしゃしんのようすからみて、たのしいパーティーだったにちがいない。", english: "Judging from what's in this photo, it must have been a fun party." }
      ]}
    ]
  },
  {
    id: "n3-kamo-shirenai", level: "N3", pattern: "～かもしれない", title: "Might / may", short: "States a moderate possibility that something is true.",
    explanation: "～かもしれない attaches to a plain-form phrase and expresses a mild, uncertain possibility — 'might' or 'may'. It's the most neutral and hedge-like of the guessing expressions, weaker in confidence than に違いない or はずだ.",
    usages: [
      { title: "Possibility", examples: [
        { japanese: "明日は雨が降るかもしれません。", furigana: "あしたはあめがふるかもしれません。", english: "It might rain tomorrow." },
        { japanese: "彼はもう来ないかもしれない。", furigana: "かれはもうこないかもしれない。", english: "He might not come anymore." },
        { japanese: "彼は今日、会社を休むかもしれない。", furigana: "かれはきょう、かいしゃをやすむかもしれない。", english: "He might take the day off work today." }
      ]}
    ]
  },
  {
    id: "n3-hazu-ga-nai", level: "N3", pattern: "～はずがない", title: "Cannot be / impossible that", short: "Strongly denies a possibility based on logical reasoning.",
    explanation: "～はずがない attaches to a plain-form phrase and firmly denies a possibility based on the speaker's confident reasoning — 'there's no way X could be true'. It's the negative counterpart of ～はずだ (which expects something to be true) and carries similar confidence, just pointed the other direction.",
    usages: [
      { title: "Logical impossibility", examples: [
        { japanese: "彼が嘘をつくはずがありません。", furigana: "かれがうそをつくはずがありません。", english: "There's no way he would lie." },
        { japanese: "こんな難しい問題が解けるはずがない。", furigana: "こんなむずかしいもんだいがとけるはずがない。", english: "There's no way I can solve such a difficult problem." },
        { japanese: "彼がそんなひどいことを言うはずがない。", furigana: "かれがそんなひどいことをいうはずがない。", english: "There's no way he would say something that awful." }
      ]}
    ]
  },
  {
    id: "n3-tame-ni-purpose", level: "N3", pattern: "～ために", title: "In order to / for the sake of", short: "Expresses deliberate intention to reach a target.",
    explanation: "Attached to dictionary-form verbs or nouns + の, ～ために states a direct purpose — 'in order to X' or 'for the sake of X'. It requires that the subject of both clauses be capable of intentional action (unlike ように, which also works with involuntary or hoped-for outcomes).",
    usages: [
      { title: "Goal", examples: [
        { japanese: "家を買うために貯金しています。", furigana: "いえをかうためにちょきんしています。", english: "I am saving money to buy a house." },
        { japanese: "夢を実現するために、留学を決めた。", furigana: "ゆめをじつげんするために、りゅうがくをきめた。", english: "I decided to study abroad in order to make my dream come true." },
        { japanese: "健康のために、毎朝走っています。", furigana: "けんこうのために、まいあさはしっています。", english: "I run every morning for the sake of my health." }
      ]}
    ]
  },
  {
    id: "n3-zu-ni", level: "N3", pattern: "～ずに", title: "Without doing", short: "A formal or written version of ～ないで.",
    explanation: "～ずに attaches to the negative stem of a verb (without い) and means 'without doing X' — a slightly more formal, written-leaning equivalent of ～ないで, often used in narration and instructions.",
    usages: [
      { title: "Action omitted", examples: [
        { japanese: "朝ご飯を食べずに学校へ来ました。", furigana: "あさごはんをたべずにがっこうへきました。", english: "I came to school without eating breakfast." },
        { japanese: "一言も言わずに去った。", furigana: "ひとこともいわずにさった。", english: "He left without saying a word." },
        { japanese: "彼は一言も言わずに、部屋を出て行った。", furigana: "かれはひとこともいわずに、へやをでていった。", english: "He left the room without saying a single word." }
      ]}
    ]
  },
  {
    id: "n3-tashika-ni", level: "N3", pattern: "確かに～が", title: "Certainly... but...", short: "Concedes a point before offering a contrasting opinion.",
    explanation: "確かに～が acknowledges that a point is true or valid, before immediately introducing a contrasting or qualifying statement with が — 'certainly X, but...'. It's a diplomatic way to concede a point while still making a counter-argument.",
    usages: [
      { title: "Concession", examples: [
        { japanese: "確かに高いですが、品質は良いです。", furigana: "たしかにたかいですが、ひんしつはよいです。", english: "It is certainly expensive, but the quality is good." },
        { japanese: "確かに難しいが、不可能ではない。", furigana: "たしかにむずかしいが、ふかのうではない。", english: "It's certainly difficult, but not impossible." },
        { japanese: "確かに値段は高いが、品質はとてもいい。", furigana: "たしかにねだんはたかいが、ひんしつはとてもいい。", english: "Certainly the price is high, but the quality is very good." }
      ]}
    ]
  },
  {
    id: "n3-gachi", level: "N3", pattern: "～がち", title: "Tend to / prone to", short: "Tendency to do something negative or undesirable.",
    explanation: "～がち attaches to the ます-stem of a verb or a noun and describes a tendency toward something, usually negative — 'tends to' or 'prone to' (病気がち, 'prone to getting sick'; 忘れがち, 'tends to forget'). It suggests a recurring pattern rather than a one-time event.",
    usages: [
      { title: "Negative tendency", examples: [
        { japanese: "一人暮らしは病気になりがちです。", furigana: "ひとりぐらしはびょうきになりがちです。", english: "Living alone makes one prone to getting sick." },
        { japanese: "彼は遅刻しがちだ。", furigana: "かれはちこくしがちだ。", english: "He tends to be late." },
        { japanese: "最近、曇りがちな天気が続いている。", furigana: "さいきん、くもりがちなてんきがつづいている。", english: "Lately, the weather has been tending toward cloudy." }
      ]}
    ]
  },
  {
    id: "n3-psoi", level: "N3", pattern: "～っぽい", title: "Ish / seems like / easily becomes", short: "Gives a strong impression of a quality, or inclination towards a trait.",
    explanation: "～っぽい attaches to a noun or verb stem and means something has a noticeable quality or resemblance to that thing, often in a casual, slightly critical, or approximate way (子供っぽい, 'childish'; 忘れっぽい, 'forgetful'). It's more casual and less precise than らしい.",
    usages: [
      { title: "Quality / Tendency", examples: [
        { japanese: "あの大人、子供っぽいですね。", furigana: "あのおとな、こどもっぽいですね。", english: "That adult is very childish, isn't he?" },
        { japanese: "この色は赤っぽいです。", furigana: "このいろはあかっぽいです。", english: "This color is reddish." },
        { japanese: "彼の話し方は少し女っぽい。", furigana: "かれのはなしかたはすこしおんなっぽい。", english: "His way of speaking is a bit feminine." }
      ]}
    ]
  },
  {
    id: "n3-muke", level: "N3", pattern: "～向け", title: "Intended for / targeted at", short: "Indicates the target demographic or audience of a product or service.",
    explanation: "～向け follows a noun describing a target audience and means something is specifically designed or intended for that group — '(made) for X' — common in product labeling and marketing (子供向け, 'for children').",
    usages: [
      { title: "Target audience", examples: [
        { japanese: "この本は子供向けに書かれています。", furigana: "このほんはこどもむけにかかれています。", english: "This book is written for children." },
        { japanese: "これは初心者向けのアプリです。", furigana: "これはしょしんしゃむけのアプリです。", english: "This is an app for beginners." },
        { japanese: "この教材は初心者向けに作られている。", furigana: "このきょうざいはしょしんしゃむけにつくられている。", english: "This teaching material is made for beginners." }
      ]}
    ]
  },
  {
    id: "n3-muki", level: "N3", pattern: "～向き", title: "Suitable for / fit for", short: "Indicates natural suitability for a particular person or group.",
    explanation: "～向き follows a noun and means something is well-suited or naturally appropriate for that group or purpose — subtly different from 向け (which implies deliberate design), 向き is more about natural fit (この靴は運動向きだ, 'these shoes are suited for exercise', regardless of whether they were specifically made for it).",
    usages: [
      { title: "Suitability", examples: [
        { japanese: "この部屋は一人暮らし向きです。", furigana: "このへやはひとりぐらしむきです。", english: "This room is suitable for living alone." },
        { japanese: "この靴は歩き向きだ。", furigana: "このくつはあるきむきだ。", english: "These shoes are good for walking." },
        { japanese: "この仕事は細かい作業が得意な人向きだ。", furigana: "このしごとはこまかいさぎょうがとくいなひとむきだ。", english: "This job is well-suited to people who are good at detailed work." }
      ]}
    ]
  },
  {
    id: "n3-dake-de-naku", level: "N3", pattern: "～だけでなく", title: "Not only... but also...", short: "Extends a statement to include additional elements.",
    explanation: "～だけでなく connects two clauses to say that something isn't limited to the first point mentioned but extends to a second one as well — 'not only X but also Y'. It's the standard, everyday version of this idea, with more formal cousins like のみならず reserved for written Japanese.",
    usages: [
      { title: "Addition", examples: [
        { japanese: "日本語だけでなく、英語も話せます。", furigana: "にほんごだけでなく、えいごもはなせます。", english: "I can speak not only Japanese, but also English." },
        { japanese: "この店は安いだけでなく、サービスも良い。", furigana: "このみせはやすいだけでなく、サービスもよい。", english: "This shop is not only cheap, but the service is also good." },
        { japanese: "彼女は歌が上手なだけでなく、ダンスも得意だ。", furigana: "かのじょはうたがじょうずなだけでなく、ダンスもとくいだ。", english: "Not only is she good at singing, she's also skilled at dancing." }
      ]}
    ]
  },
  {
    id: "n3-shikanai-verb", level: "N3", pattern: "～しかない", title: "Have no choice but to", short: "Expresses having no alternative other than doing a specific action.",
    explanation: "～しかない attaches to the dictionary form of a verb and means 'there's nothing to do but X' — given the circumstances, this is the one remaining course of action, with a tone of resigned acceptance rather than active choice.",
    usages: [
      { title: "Only option left", examples: [
        { japanese: "バスがないから、歩くしかありません。", furigana: "バスがないから、あるくしかありません。", english: "Since there's no bus, I have no choice but to walk." },
        { japanese: "彼を信じるしかない。", furigana: "かれをしんじるしかない。", english: "I have no choice but to trust him." },
        { japanese: "電車がないので、歩いて帰るしかない。", furigana: "でんしゃがないので、あるいてかえるしかない。", english: "There's no train, so I have no choice but to walk home." }
      ]}
    ]
  },
  {
    id: "n3-kanarazu-shimo", level: "N3", pattern: "必ずしも～とは限らない", title: "Not necessarily true that", short: "Softens a general rule by noting exceptions.",
    explanation: "必ずしも～とは限らない pairs 必ずしも ('necessarily') with とは限らない ('is not necessarily the case') to soften an absolute claim — 'it's not necessarily always true that X'. It's a common, diplomatic way to push back against an overgeneralization.",
    usages: [
      { title: "Partial denial", examples: [
        { japanese: "高いものが必ずしも良いとは限らない。", furigana: "たかいものがかならずしもよいとはかぎらない。", english: "Expensive things are not necessarily good." },
        { japanese: "彼の言うことが必ずしも正しいとは限らない。", furigana: "かれのいうことがかならずしもただしいとはかぎらない。", english: "What he says is not necessarily correct." },
        { japanese: "高いものが必ずしも品質がいいとは限らない。", furigana: "たかいものがかならずしもひんしつがいいとはかぎらない。", english: "Expensive things aren't necessarily always good quality." }
      ]}
    ]
  },
  {
    id: "n3-koto-ni-natte-iru", level: "N3", pattern: "～ことになっている", title: "It is rule/custom that", short: "Describes an established rule, standard, or arrangement.",
    explanation: "～ことになっている describes a rule, custom, or arrangement that's currently in effect — 'it's set up so that X' or 'the rule is that X'. It emphasizes an established, ongoing arrangement rather than a one-time decision (which would use ことになった).",
    usages: [
      { title: "Established rule", examples: [
        { japanese: "この部屋では靴を脱ぐことになっています。", furigana: "このへやではくつをぬぐことになっています。", english: "It is a rule to take off your shoes in this room." },
        { japanese: "明日、会議があることになっている。", furigana: "あした、かいぎがあることになっている。", english: "It's scheduled that there will be a meeting tomorrow." },
        { japanese: "この学校では、制服を着ることになっている。", furigana: "このがっこうでは、せいふくをきることになっている。", english: "At this school, the rule is that you wear a uniform." }
      ]}
    ]
  },
  {
    id: "n3-koto-da", level: "N3", pattern: "～ことだ", title: "Should / imperative advice", short: "Gives direct advice on the best course of action.",
    explanation: "～ことだ attaches to the dictionary or negative form of a verb and gives advice in the form of a general principle — 'the thing to do is X' or 'you should X'. It sounds like offering wisdom rather than issuing a direct command, often used when giving advice based on common sense.",
    usages: [
      { title: "Direct advice", examples: [
        { japanese: "日本語が上手になりたければ、毎日話すことです。", furigana: "にほんごがじょうずになりたければ、まいにちはなすことです。", english: "If you want to get better at Japanese, you should speak it every day." },
        { japanese: "そんな時は、慌てないことだ。", furigana: "そんなときは、あわてないことだ。", english: "In such times, you shouldn't panic." },
        { japanese: "疲れた時は、無理せず休むことだ。", furigana: "つかれたときは、むりせずやすむことだ。", english: "When you're tired, the thing to do is rest without overdoing it." }
      ]}
    ]
  },
  {
    id: "n3-tsuide-ni", level: "N3", pattern: "～ついでに", title: "While you're at it / incidentally", short: "Perform a secondary action while taking opportunity of a primary action.",
    explanation: "～ついでに attaches to a noun + の or the dictionary form of a verb and means 'while doing X (as a convenient extra), also do Y' — the second action is a bonus made possible by already being in the middle of the first, saving the effort of a separate trip or task.",
    usages: [
      { title: "Secondary action", examples: [
        { japanese: "散歩のついでに、手紙を出してきました。", furigana: "さんぽのついでに、てがみをだしてきました。", english: "While out for a walk, I mailed the letter." },
        { japanese: "買い物のついでに、本屋に寄った。", furigana: "かいもののついでに、ほんやによった。", english: "While shopping, I stopped by the bookstore." },
        { japanese: "郵便局に行くついでに、コンビニにも寄った。", furigana: "ゆうびんきょくにいくついでに、コンビニにもよった。", english: "While going to the post office, I also stopped by the convenience store." }
      ]}
    ]
  },
  {
    id: "n3-tabini", level: "N3", pattern: "～たびに", title: "Every time / whenever", short: "Emphasizes that event Y repeatedly happens whenever event X occurs.",
    explanation: "～たびに attaches to a noun + の or the dictionary form of a verb and means 'every time X happens' — a natural, everyday way to describe something that reliably recurs alongside another event, common in both speech and writing.",
    usages: [
      { title: "Repetition", examples: [
        { japanese: "この曲を聴くたびに、故郷を思い出します。", furigana: "このきょくをきくたびに、ふるさとをおもいだします。", english: "Every time I listen to this song, I remember my hometown." },
        { japanese: "旅行するたびに、お土産を買う。", furigana: "りょこうするたびに、おみやげをかう。", english: "Every time I travel, I buy souvenirs." },
        { japanese: "彼女に会うたびに、元気をもらえる。", furigana: "かのじょにあうたびに、げんきをもらえる。", english: "Every time I see her, I feel energized." }
      ]}
    ]
  },
  {
    id: "n3-sora-mou", level: "N3", pattern: "まるで～のようだ / みたいだ", title: "Just like / as if", short: "Creates a vivid figurative comparison.",
    explanation: "まるで pairs with のようだ or みたいだ at the end of the sentence to make a vivid, sometimes exaggerated comparison — 'just like X' or 'as if it were X'. まるで itself signals that a striking simile is coming, making the comparison feel more emphatic than のようだ alone would.",
    usages: [
      { title: "Simile", examples: [
        { japanese: "今日はまるで春のような暖かさです。", furigana: "きょうはまるではるのようなあたたかさです。", english: "Today is warm, just as if it were spring." },
        { japanese: "彼はまるでロボットのように働く。", furigana: "かれはまるでロボットのようにはたらく。", english: "He works just like a robot." },
        { japanese: "この人形はまるで生きているみたいだ。", furigana: "このにんぎょうはまるでいきているみたいだ。", english: "This doll looks just like it's alive." }
      ]}
    ]
  },
  {
    id: "n3-te-hajimete", level: "N3", pattern: "～てはじめて", title: "Only after / not until", short: "Realizing or experiencing something only after a specific event takes place.",
    explanation: "～てはじめて attaches to the て-form of a verb and means 'it was only after doing X that I realized/understood Y' — the experience described was necessary for the following realization to happen; without it, the insight wouldn't have come.",
    usages: [
      { title: "Late realization", examples: [
        { japanese: "病気になってはじめて健康の難しさを知りました。", furigana: "びょうきになってはじめてけんこうのむずかしさをしりました。", english: "Only after getting sick did I realize how valuable health is." },
        { japanese: "海外に行ってはじめて日本の良さが分かった。", furigana: "かいがいにいってはじめてにほんのよさがわかった。", english: "Only after going abroad did I understand Japan's good points." },
        { japanese: "自分で会社を経営してはじめて、社長の大変さが分かった。", furigana: "じぶんでかいしゃをけいえいしてはじめて、しゃちょうのたいへんさがわかった。", english: "It was only after running my own company that I understood how hard being a president is." }
      ]}
    ]
  },
  {
    id: "n3-te-karadenai-to", level: "N3", pattern: "～てからでないと", title: "Unless / until X is done", short: "States that action Y cannot be performed until action X is complete.",
    explanation: "～てからでないと attaches to the て-form of a verb and means 'not until after doing X' — a following action or state is impossible without first completing this one. It's often used with a negative outcome to stress a required first step.",
    usages: [
      { title: "Prerequisite", examples: [
        { japanese: "許可をもらってからでないと、入れません。", furigana: "きょかをもらってからでないと、はいれません。", english: "Unless you get permission, you cannot enter." },
        { japanese: "ご飯を食べてからでないと、薬が飲めない。", furigana: "ごはんをたべてからでないと、くすりがのめない。", english: "Unless I eat, I can't take the medicine." },
        { japanese: "予約してからでないと、この店には入れません。", furigana: "よやくしてからでないと、このみせにははいれません。", english: "You can't get into this restaurant without making a reservation first." }
      ]}
    ]
  },
  {
    id: "n3-saie-ba", level: "N3", pattern: "～さえ～ば", title: "If only / as long as", short: "States the sole necessary condition required for an outcome.",
    explanation: "～さえ～ば attaches さえ to a noun (or verb stem) and combines with the ば-conditional to mean 'if only X, then everything else follows' — this one condition is presented as sufficient on its own, with nothing else needed.",
    usages: [
      { title: "Sole condition", examples: [
        { japanese: "薬を飲みさえすれば、治ります。", furigana: "くすりをのみさえすれば、なおります。", english: "As long as you take the medicine, you will get better." },
        { japanese: "時間さえあれば、読めるのに。", furigana: "じかんさえあれば、よめるのに。", english: "If only I had time, I could read it." },
        { japanese: "お金さえあれば、何でも買えるわけではない。", furigana: "おかねさえあれば、なんでもかえるわけではない。", english: "It's not the case that if you just have money, you can buy anything." }
      ]}
    ]
  },
  {
    id: "n3-ageku", level: "N3", pattern: "～あげく（に）", title: "After much trouble, in the end", short: "After a long process of deliberation or struggle, a (usually disappointing) result.",
    explanation: "～あげく（に）attaches to the past-tense form of a verb or a noun + の and means 'after a long, drawn-out process of X, the outcome was Y' — almost always a disappointing or exhausting result following extended effort, hesitation, or struggle.",
    usages: [
      { title: "Troubled process ending badly", examples: [
        { japanese: "迷ったあげく、結局何も買わなかった。", furigana: "まよったあげく、けっきょくなにもかわなかった。", english: "After much deliberation, I ended up buying nothing." },
        { japanese: "議論のあげく、結論は出なかった。", furigana: "ぎろんのあげく、けつろんはでなかった。", english: "After all that discussion, no conclusion was reached." },
        { japanese: "さんざん迷ったあげく、結局何も買わなかった。", furigana: "さんざんまよったあげく、けっきょくなにもかわなかった。", english: "After agonizing over it for ages, I ended up not buying anything at all." }
      ]}
    ], notes: "A common related pattern is ～た末（すえ）に, which is similar but more neutral in tone."
  },
  {
    id: "n3-bakari-ka", level: "N3", pattern: "～ばかりか", title: "Not only... but also", short: "Adds information on top of what was said, often with a surprising or critical nuance.",
    explanation: "～ばかりか connects two clauses to say that something isn't limited to the first, often already surprising, fact — an even more striking second fact follows too. It's similar to だけでなく but carries a stronger sense of escalating surprise.",
    usages: [
      { title: "Adding to an already strong case", examples: [
        { japanese: "彼は日本語ばかりか、中国語も話せます。", furigana: "かれはにほんごばかりか、ちゅうごくごもはなせます。", english: "He speaks not only Japanese but also Chinese." },
        { japanese: "この店は高いばかりか、量も少ない。", furigana: "このみせはたかいばかりか、りょうもすくない。", english: "This restaurant is not only expensive, the portions are small too." },
        { japanese: "彼は宿題を忘れたばかりか、教科書も持ってこなかった。", furigana: "かれはしゅくだいをわすれたばかりか、きょうかしょももってこなかった。", english: "Not only did he forget his homework, he didn't even bring his textbook." }
      ]}
    ]
  },
  {
    id: "n3-darake", level: "N3", pattern: "～だらけ", title: "Covered in / full of", short: "A surface or thing is covered with, or full of, something unwanted.",
    explanation: "～だらけ attaches to a noun describing something messy or undesirable and means it's completely covered in or full of that thing — 泥だらけ ('covered in mud'), 間違いだらけ ('full of mistakes'). It always carries a negative or critical nuance, unlike the neutral まみれ used for physical substances.",
    usages: [
      { title: "Physical covering", examples: [
        { japanese: "靴は泥だらけです。", furigana: "くつはどろだらけです。", english: "My shoes are covered in mud." },
        { japanese: "このレポートは間違いだらけだ。", furigana: "このレポートはまちがいだらけだ。", english: "This report is full of mistakes." }
      ]},
      { title: "Full of flaws", examples: [
        { japanese: "部屋はゴミだらけです。", furigana: "へやはゴミだらけです。", english: "The room is full of rubbish." },
        { japanese: "試験の答案は間違いだらけだった。", furigana: "しけんのとうあんはまちがいだらけだった。", english: "My exam paper was full of mistakes." }
      ]}
    ], notes: "Compare with N1 ～まみれ: だらけ can be abstract (mistakes, lies), while まみれ is mostly physical substances."
  },
  {
    id: "n3-tsutsu", level: "N3", pattern: "～つつ", title: "While / although (adversative)", short: "Two states exist at the same time even though they conflict.",
    explanation: "～つつ attaches to the ます-stem of a verb and has two related uses: describing two actions happening at the same time (a more formal, literary equivalent of ながら), or, at the end of a sentence as つつも, introducing a contradiction — 'while knowing X, still doing Y'.",
    usages: [
      { title: "Knowing but doing anyway", examples: [
        { japanese: "悪いと知りつつ、つい甘いものを食べてしまう。", furigana: "わるいとしりつつ、ついあまいものをたべてしまう。", english: "Even though I know it's bad, I can't help eating sweets." },
        { japanese: "無理だと思いつつ、もう一度挑戦した。", furigana: "むりだとおもいつつ、もういちどちょうせんした。", english: "Although I thought it was impossible, I tried once more." },
        { japanese: "テレビを見つつ、夕食を食べた。", furigana: "テレビをみつつ、ゆうしょくをたべた。", english: "I ate dinner while watching TV." }
      ]}
    ], notes: "Do not confuse with ～つつある below, which describes gradual ongoing change."
  },
  {
    id: "n3-tsutsu-aru", level: "N3", pattern: "～つつある", title: "In the process of changing", short: "Describes a gradual, ongoing transformation.",
    explanation: "～つつある attaches to the ます-stem of a verb and describes a change that is currently, gradually in progress — 'is in the process of becoming X'. It's more formal than ている and specifically highlights an ongoing trend or transition, not a static continuous state.",
    usages: [
      { title: "Gradual change", examples: [
        { japanese: "日本の働き方は変わりつつある。", furigana: "にほんのはたらきかたはかわりつつある。", english: "The way people work in Japan is gradually changing." },
        { japanese: "事態は好転しつつある。", furigana: "じたいはこうてんしつつある。", english: "The situation is in the process of improving." },
        { japanese: "この町の人口は年々減りつつある。", furigana: "このまちのじんこうはねんねんへりつつある。", english: "This town's population is gradually decreasing year by year." }
      ]}
    ]
  },
  {
    id: "n3-mono-da", level: "N3", pattern: "～ものだ", title: "General truths / nostalgia / how things should be", short: "States universal truths, reminisces about the past, or states proper behavior.",
    explanation: "～ものだ attaches to a plain-form phrase and states something as general common sense or a widely accepted truth — 'that's just how things are' or 'people naturally do X'. It can also express nostalgic reminiscence about the past (よく〜したものだ, 'I used to X a lot').",
    usages: [
      { title: "General truth", examples: [
        { japanese: "月は神秘的なものだ。", furigana: "つきはしんぴてきなものだ。", english: "The moon is a mysterious thing." },
        { japanese: "子供は親の背中を見て育つものだ。", furigana: "こどもはおやのせなかをみてそだつものだ。", english: "Children naturally grow up watching their parents' example." }
      ]},
      { title: "Nostalgic past", examples: [
        { japanese: "子供のころは、よく川で泳いだものだ。", furigana: "こどものころは、よくかわでおよいだものだ。", english: "When I was a child, I used to swim in the river all the time." }
      ]},
      { title: "Proper behavior", examples: [
        { japanese: "人の気持ちを尊重するものだ。", furigana: "ひとのきもちをそんちょうするものだ。", english: "One should respect other people's feelings." }
      ]}
    ]
  },
  {
    id: "n3-mono-de-wa-nai", level: "N3", pattern: "～ものではない", title: "Should not / it is not right to", short: "States that an action is socially or morally unacceptable.",
    explanation: "～ものではない attaches to the dictionary form of a verb and states a general rule about what people should not do — it sounds like timeless wisdom or social convention rather than a direct personal command, similar in spirit to ものだ but in its prohibitive form.",
    usages: [
      { title: "General prohibition", examples: [
        { japanese: "人を外見で判断するものではありません。", furigana: "ひとをがいけんではんだんするものではありません。", english: "One should not judge people by their appearance." },
        { japanese: "友達の悪口を言うものではない。", furigana: "ともだちのわるぐちをいうものではない。", english: "One shouldn't speak ill of one's friends." },
        { japanese: "他人の物を勝手に使うものではない。", furigana: "たにんのものをかってにつかうものではない。", english: "One shouldn't use other people's things without asking." }
      ]}
    ]
  },
  {
    id: "n3-doko-ro-ka", level: "N3", pattern: "～どころか", title: "Far from / anything but", short: "The reality is completely opposite to what was expected.",
    explanation: "～どころか attaches to a noun or plain-form phrase and rejects it in favor of something at the opposite extreme — 'far from X, it's actually Y' — the reality turns out to be the complete reverse of what was expected or stated.",
    usages: [
      { title: "Reversed reality", examples: [
        { japanese: "休むどころか、週末も働いています。", furigana: "やすむどころか、しゅうまつもはたらいています。", english: "Far from getting a rest, I'm working weekends too." },
        { japanese: "上手になるどころか、どんどん下手になった。", furigana: "じょうずになるどころか、どんどんへたになった。", english: "Far from improving, I'm getting worse and worse." },
        { japanese: "彼は忙しいどころか、毎日暇そうにしている。", furigana: "かれはいそがしいどころか、まいにちひまそうにしている。", english: "Far from being busy, he looks bored every single day." }
      ]}
    ]
  },
  {
    id: "n3-ni-taishite", level: "N3", pattern: "～に対して / ～に対する", title: "Toward / against / compared with", short: "Marks the target of an attitude, action, or comparison.",
    explanation: "～に対して follows a noun and marks the direction of an action, attitude, or feeling — 'toward X' or 'in response to X'. Unlike にとって (which frames a subjective viewpoint), に対して describes something being directed at a target, often in a formal or slightly confrontational context.",
    usages: [
      { title: "Attitude toward someone", examples: [
        { japanese: "先生に対して失礼なことを言ってしまいました。", furigana: "せんせいにたいしてしつれいなことをいってしまいました。", english: "I said something rude to my teacher." },
        { japanese: "彼はどんな質問に対しても、丁寧に答えてくれる。", furigana: "かれはどんなしつもんにたいしても、ていねいにこたえてくれる。", english: "He answers any question politely, whatever it may be." }
      ]},
      { title: "Comparison", examples: [
        { japanese: "去年に対して、今年の売り上げは二割増えた。", furigana: "きょねんにたいして、ことしのうりあげはにわりふえた。", english: "Compared with last year, sales are up twenty percent." }
      ]}
    ]
  },
  {
    id: "n3-ni-owite", level: "N3", pattern: "～に応えて / ～に応える", title: "In response to / meeting", short: "Acting in a way that answers a request, expectation, or demand.",
    explanation: "～に応えて attaches to nouns like 要望 (request), 期待 (expectation), or 声 (voice) and describes an action taken specifically to meet or answer them. It frames the following action as a direct, responsive reaction to what was asked for or hoped for.",
    usages: [
      { title: "Meeting expectations", examples: [
        { japanese: "顧客の要望に応えて、商品を改良しました。", furigana: "こきゃくのようぼうにこたえて、しょうひんをかいりょうしました。", english: "We improved the product in response to customer requests." },
        { japanese: "ファンの期待に応えて、もう一曲歌った。", furigana: "ファンのきたいにこたえて、もういっきょくうたった。", english: "In response to the fans' expectations, I sang one more song." },
        { japanese: "地域住民の声に応えて、公園が新設された。", furigana: "ちいきじゅうみんのこえにこたえて、こうえんがしんせつされた。", english: "In response to local residents' voices, a new park was built." }
      ]}
    ]
  },
  {
    id: "n3-ni-kuwaete", level: "N3", pattern: "～に加えて", title: "In addition to", short: "Adds one more factor on top of an existing one.",
    explanation: "～に加えて follows a noun and introduces an additional element of the same kind — 'in addition to X'. It's common in both spoken and written Japanese for listing extra factors, requirements, or qualities alongside an already-mentioned one.",
    usages: [
      { title: "Additional factor", examples: [
        { japanese: "雨に加えて、強風も吹いています。", furigana: "あめにくわえて、きょうふうもふいています。", english: "In addition to rain, strong winds are blowing." },
        { japanese: "経験に加えて、資格も必要だ。", furigana: "けいけんにくわえて、しかくもひつようだ。", english: "In addition to experience, qualifications are also necessary." },
        { japanese: "経験に加えて、資格も必要です。", furigana: "けいけんにくわえて、しかくもひつようです。", english: "In addition to experience, a qualification is also necessary." }
      ]}
    ]
  },
  {
    id: "n3-ni-hikakete", level: "N3", pattern: "～に比べて", title: "Compared with", short: "Contrasts two things on the same scale.",
    explanation: "～に比べて follows a noun and sets up a direct comparison — 'compared to X'. It's a straightforward, everyday comparison marker, less formal than にひきかえ (which carries a stronger, more pointed sense of contrast).",
    usages: [
      { title: "Comparison", examples: [
        { japanese: "去年に比べて、今年の夏は涼しい。", furigana: "きょねんにくらべて、ことしのなつはすずしい。", english: "Compared with last year, this summer is cool." },
        { japanese: "男性に比べて、女性の方が長生きする。", furigana: "だんせいにくらべて、じょせいのほうがながいきする。", english: "Compared to men, women live longer." },
        { japanese: "去年に比べて、今年の夏は暑い。", furigana: "きょねんにくらべて、ことしのなつはあつい。", english: "Compared to last year, this summer is hot." }
      ]}
    ]
  },
  {
    id: "n3-ni-shitagatte", level: "N3", pattern: "～に従って", title: "According to / in proportion to", short: "Following rules, or changing in step with something else.",
    explanation: "～に従って follows a noun and means 'in accordance with X' or 'following X' — obeying a rule, instruction, or set of guidelines. It shares a meaning with にしたがって (using the same kanji, different but related grammatical role) — one describes following a rule, the other a gradual change happening in step with something.",
    usages: [
      { title: "Following rules", examples: [
        { japanese: "説明書に従って組み立ててください。", furigana: "せつめいしょにしたがってくみたててください。", english: "Please assemble it according to the instructions." },
        { japanese: "指示に従って、避難してください。", furigana: "しじにしたがって、ひなんしてください。", english: "Please evacuate in accordance with the instructions." }
      ]},
      { title: "Proportional change", examples: [
        { japanese: "年を取るに従って、体力が落ちる。", furigana: "としをとるにしたがって、たいりょくがおちる。", english: "As you get older, your physical strength declines." }
      ]}
    ], notes: "The change meaning overlaps with N2 ～につれて; 従って emphasizes compliance or direct correlation."
  },
  {
    id: "n3-ni-shitara", level: "N3", pattern: "～にしたら / ～にしてみれば", title: "From the viewpoint of", short: "Describes how something appears or feels to a particular person.",
    explanation: "～にしたら (or ～にしてみれば) follows a noun (usually a person) and frames a statement from that person's point of view — 'from X's standpoint' — often used to note that someone might see a situation quite differently than the speaker does.",
    usages: [
      { title: "Someone's perspective", examples: [
        { japanese: "親にしたら、子供の将来が一番心配だ。", furigana: "おやにしたら、こどものしょうらいがいちばんしんぱいだ。", english: "From a parent's point of view, their child's future is the biggest worry." },
        { japanese: "彼にしてみれば、当然の行動だった。", furigana: "かれにしてみれば、とうぜんのこうどうだった。", english: "From his perspective, it was a natural action." },
        { japanese: "親にしてみれば、子供の結婚は複雑な気持ちだ。", furigana: "おやにしてみれば、こどものけっこんはふくざつなきもちだ。", english: "From a parent's perspective, a child's marriage brings complicated feelings." }
      ]}
    ]
  },
  {
    id: "n3-ni-shitemo", level: "N3", pattern: "～にしても", title: "Even if / even for", short: "Concedes a point while still holding the main opinion.",
    explanation: "～にしても attaches to nouns, adjectives, or verb plain forms and means 'even considering X' or 'even if X is true' — it softens disagreement by partially accepting the other side's point before adding a qualification.",
    usages: [
      { title: "Concession", examples: [
        { japanese: "いくら忙しいにしても、寝る時間ぐらいは欲しい。", furigana: "いくらいそがしいにしても、ねるじかんぐらいはほしい。", english: "No matter how busy you are, you must want at least time to sleep." },
        { japanese: "冗談にしても、あの言い方はひどい。", furigana: "じょうだんにしても、あのいいかたはひどい。", english: "Even granting it was a joke, that way of putting it was harsh." },
        { japanese: "安いにしても、こんな質の悪い物は買いたくない。", furigana: "やすいにしても、こんなしつのわるいものはかいたくない。", english: "Even if it's cheap, I don't want to buy something this poor in quality." }
      ]}
    ]
  },
  {
    id: "n3-ni-tomonatte", level: "N3", pattern: "～に伴って", title: "Along with / accompanied by", short: "One change brings another related change along with it.",
    explanation: "～に伴って follows a noun describing a change and means 'as X happens, Y happens along with it' — a formal expression common in news and academic writing describing two related developments occurring together.",
    usages: [
      { title: "Accompanying change", examples: [
        { japanese: "人口の増加に伴って、問題も増えている。", furigana: "じんこうのぞうかにともなって、もんだいもふえている。", english: "Along with population growth, problems are also increasing." },
        { japanese: "経済発展に伴って、生活水準が向上した。", furigana: "けいざいはってんにともなって、せいかつすいじゅんがこうじょうした。", english: "Along with economic development, living standards have improved." },
        { japanese: "少子化に伴って、学校の数も減っている。", furigana: "しょうしかにともなって、がっこうのかずもへっている。", english: "Along with the declining birthrate, the number of schools is also decreasing." }
      ]}
    ]
  },
  {
    id: "n3-ni-mo-kakawarazu", level: "N3", pattern: "～にもかかわらず", title: "Despite / in spite of", short: "A formal contrast: the result holds even though the condition was unfavorable.",
    explanation: "～にもかかわらず follows a noun or plain-form phrase and means 'despite X' or 'in spite of X' — the outcome runs contrary to what the stated circumstance would normally lead you to expect, similar in force to のに but more formal.",
    usages: [
      { title: "Formal contrast", examples: [
        { japanese: "大雨にもかかわらず、試合は行われた。", furigana: "おおあめにもかかわらず、しあいはおこなわれた。", english: "Despite the heavy rain, the match was held." },
        { japanese: "反対が多いにもかかわらず、計画は進められた。", furigana: "はんたいがおおいにもかかわらず、けいかくはすすめられた。", english: "Despite much opposition, the plan went ahead." },
        { japanese: "雨にもかかわらず、大勢の人が集まった。", furigana: "あめにもかかわらず、おおぜいのひとがあつまった。", english: "Despite the rain, a large crowd gathered." }
      ]}
    ], notes: "Synonymous with のに in meaning, but more formal and objective."
  },
  {
    id: "n3-nuki-de", level: "N3", pattern: "～抜きで / ～抜きの", title: "Without / leaving out", short: "Doing something with a usual element removed.",
    explanation: "～抜きで follows a noun and means 'without X' or 'leaving X out' — often a component that's normally included but has been deliberately omitted this time (冗談抜きで, 'joking aside'; ねぎ抜きで, 'without green onion').",
    usages: [
      { title: "With something removed", examples: [
        { japanese: "砂糖抜きのコーヒーをください。", furigana: "さとうぬきのコーヒーをください。", english: "A coffee without sugar, please." },
        { japanese: "冗談抜きで、本気で言っています。", furigana: "じょうだんぬきで、ほんきでいっています。", english: "I'm saying this seriously, no joking." },
        { japanese: "今日は冗談抜きで、真剣な話がある。", furigana: "きょうはじょうだんぬきで、しんけんなはなしがある。", english: "Today, joking aside, I have something serious to talk about." }
      ]}
    ]
  },
  {
    id: "n3-nuku", level: "N3", pattern: "～ぬく", title: "Through to the end", short: "Carrying an action all the way to completion despite difficulty.",
    explanation: "～ぬく attaches to the ます-stem of a verb and means completing an action all the way through, despite difficulty — 'to do X to the very end' or 'to see X through'. It emphasizes endurance and persistence more strongly than きる.",
    usages: [
      { title: "Seeing it through", examples: [
        { japanese: "最後までやりぬきます。", furigana: "さいごまでやりぬきます。", english: "I will see it through to the very end." },
        { japanese: "痛みを我慢し抜いた。", furigana: "いたみをがまんしぬいた。", english: "I endured the pain to the end." },
        { japanese: "厳しい練習を最後までやり抜いた。", furigana: "きびしいれんしゅうをさいごまでやりぬいた。", english: "I saw the tough training through to the very end." }
      ]}
    ]
  },
  {
    id: "n3-hoka-nai", level: "N3", pattern: "～ほかない / ～ほかならない", title: "Have no choice but to", short: "All other options are gone; this is the only remaining action.",
    explanation: "～ほかない attaches to the dictionary form of a verb and means 'there's no choice but to do X' — the everyday, N3-level version of the idea, with よりほかない (N2) being a slightly more formal variant of the same meaning.",
    usages: [
      { title: "Only option", examples: [
        { japanese: "謝るほかありません。", furigana: "あやまるほかありません。", english: "I have no choice but to apologize." },
        { japanese: "この状況では、待つほかない。", furigana: "このじょうきょうでは、まつほかない。", english: "In this situation, there's nothing to do but wait." }
      ]},
      { title: "Noun version", examples: [
        { japanese: "今の解決策は待つことほかならない。", furigana: "いまのかいけつさくはまつことほかならない。", english: "The only solution now is to wait." }
      ]}
    ], notes: "Overlaps with N3 ～しかない; ほかない feels slightly more formal and conclusive."
  },
  {
    id: "n3-ba-hodo", level: "N3", pattern: "～ば～ほど", title: "The more... the more...", short: "One degree increases in direct proportion to another.",
    explanation: "～ば～ほど repeats the same verb or adjective in its ば-form and its plain form, meaning 'the more X, the more Y' — a proportional relationship where increasing one thing correspondingly increases the other.",
    usages: [
      { title: "Proportional degree", examples: [
        { japanese: "この本は読めば読むほどおもしろい。", furigana: "このほんはよめばよむほどおもしろい。", english: "The more I read this book, the more interesting it gets." },
        { japanese: "考えれば考えるほど、分からなくなる。", furigana: "かんがえればかんがえるほど、わからなくなる。", english: "The more I think about it, the less I understand." },
        { japanese: "早ければ早いほど、いい結果につながる。", furigana: "はやければはやいほど、いいけっかにつながる。", english: "The earlier it is, the better the results will be." }
      ]}
    ]
  },
  {
    id: "n3-panashi", level: "N3", pattern: "～っぱなし", title: "Left as is / continuously", short: "A state is left unchanged, or an action continues nonstop.",
    explanation: "～っぱなし attaches to the ます-stem of a verb and describes something left in a state without being properly attended to — a task left unfinished, a light left on, a door left open — usually with a nuance of carelessness or neglect.",
    usages: [
      { title: "Left unchanged", examples: [
        { japanese: "窓を開けっぱなしにして出かけた。", furigana: "まどをあけっぱなしにしてでかけた。", english: "I went out leaving the window open." },
        { japanese: "電気をつけっぱなしだ。", furigana: "でんきをつけっぱなしだ。", english: "The light has been left on." },
        { japanese: "エアコンをつけっぱなしにして出かけてしまった。", furigana: "エアコンをつけっぱなしにしてでかけてしまった。", english: "I went out and left the air conditioner running." }
      ]},
      { title: "Continuous action", examples: [
        { japanese: "昨日は一日中泣きっぱなしだった。", furigana: "きのうはいちにちじゅうなきっぱなしだった。", english: "Yesterday I cried nonstop all day." }
      ]}
    ]
  },
  {
    id: "n3-sue-ni", level: "N3", pattern: "～末に / ～末の", title: "After a long process, finally", short: "A result reached at the end of prolonged effort or discussion.",
    explanation: "～末に attaches to the past-tense form of a verb or a noun + の and means 'after a long process of X, finally...' — similar to あげく, but sue-ni doesn't carry the same negative connotation; it can lead to either a positive or negative final outcome.",
    usages: [
      { title: "Long process, final result", examples: [
        { japanese: "長い議論の末に、ようやく結論が出た。", furigana: "ながいぎろんのすえに、ようやくけつろんがでた。", english: "After long discussion, a conclusion was finally reached." },
        { japanese: "苦労の末、成功した。", furigana: "くろうのすえ、せいこうした。", english: "After much effort, I succeeded." },
        { japanese: "何年もの努力の末に、ついに夢を叶えた。", furigana: "なんねんものどりょくのすえに、ついにゆめをかなえた。", english: "After years of effort, I finally made my dream come true." }
      ]}
    ]
  },
  {
    id: "n3-yara", level: "N3", pattern: "～やら～やら", title: "This and that / and so on", short: "Lists multiple things in a scattered, overwhelmed, or emotional way.",
    explanation: "～やら～やら lists two or more things (often chaotic, mixed emotions or a jumble of activities) with a sense of disorder or overwhelm — 'what with X and Y (and who knows what else)'. It's more expressive and less neutral than や, which is a plain, calm listing particle.",
    usages: [
      { title: "Overwhelmed listing", examples: [
        { japanese: "泣くやら笑うやら、大騒ぎでした。", furigana: "なくやらわらうやら、おおさわぎでした。", english: "There was a huge commotion — crying, laughing, and everything in between." },
        { japanese: "荷物やら書類やらで部屋が散らかっている。", furigana: "にもつやらしょるいやらでへやがちらかっている。", english: "The room is messy with luggage and documents and things." },
        { japanese: "引っ越しの準備で、荷造りやら掃除やらで忙しい。", furigana: "ひっこしのじゅんびで、にづくりやらそうじやらでいそがしい。", english: "I'm busy with moving preparations — packing, cleaning, and everything else." }
      ]}
    ]
  },
  {
    id: "n3-sae-mo", level: "N3", pattern: "～さえも", title: "Even (emphatic)", short: "A stronger version of さえ: not even the minimum was possible.",
    explanation: "～さえも is a stronger, more emphatic version of さえ — naming an extreme example to underscore just how far a statement extends, similar to ですら but usable in less formal contexts as well.",
    usages: [
      { title: "Strong emphasis", examples: [
        { japanese: "忙しすぎて、飯を食べる時間さえもない。", furigana: "いそがしすぎて、めしをたべるじかんさえもない。", english: "I'm so busy I don't even have time to eat." },
        { japanese: "漢字どころか、ひらがなさえも読めません。", furigana: "かんじどころか、ひらがなさえもよめません。", english: "Far from kanji, I can't even read hiragana." },
        { japanese: "疲れすぎて、お風呂に入る元気さえもなかった。", furigana: "つかれすぎて、おふろにはいるげんきさえもなかった。", english: "I was so tired I didn't even have the energy to take a bath." }
      ]}
    ]
  },
  {
    id: "n3-gatai", level: "N3", pattern: "～がたい", title: "Hard to / difficult to", short: "Says an action is difficult or almost impossible to carry out emotionally or practically.",
    explanation: "～がたい attaches to the ます-stem of a small set of verbs (信じる, 忘れる, 許す) and means the action is very hard to do, often because of strong feeling rather than physical difficulty — it's an emotional or moral kind of 'hard', not a practical one.",
    usages: [
      { title: "Emotionally hard to do", examples: [
        { japanese: "彼の話は信じがたい。", furigana: "かれのはなしはしんじがたい。", english: "His story is hard to believe." },
        { japanese: "あの日のことは忘れがたい。", furigana: "あのひのことはわすれがたい。", english: "That day is hard to forget." },
        { japanese: "あの日の悲しみは忘れがたい。", furigana: "あのひのかなしみはわすれがたい。", english: "The sorrow of that day is hard to forget." }
      ]}
    ], notes: "Compare with N4 ～にくい: にくい is about physical or practical difficulty (this pen is hard to write with), while がたい is about emotional or moral difficulty and only pairs with a small set of verbs."
  },
  {
    id: "n3-beki", level: "N3", pattern: "～べき / ～べきではない", title: "Should / Must (moral obligation)", short: "States what someone ought to do based on duty, common sense, or moral judgment.",
    explanation: "～べき attaches to the dictionary form of a verb (する becomes すべき) and expresses a strong sense of duty or what is objectively the right thing to do. ～べきではない is its negative, meaning 'should not' — both carry more moral or social weight than the softer ほうがいい.",
    usages: [
      { title: "Stating obligation", examples: [
        { japanese: "もっと運動するべきです。", furigana: "もっとうんどうするべきです。", english: "You should exercise more." },
        { japanese: "若いうちに色々な経験をするべきだ。", furigana: "わかいうちにいろいろなけいけんをするべきだ。", english: "You should have various experiences while young." },
        { japanese: "困っている人を見たら、助けるべきだ。", furigana: "こまっているひとをみたら、たすけるべきだ。", english: "If you see someone in trouble, you should help them." }
      ]},
      { title: "Negative obligation", examples: [
        { japanese: "他人の悪口を言うべきではない。", furigana: "たにんのわるぐちをいうべきではない。", english: "You shouldn't speak ill of others." }
      ]}
    ], notes: "する attaches irregularly as すべき (the older, more formal form) alongside the regular するべき; both are common today."
  },
  {
    id: "n3-toiu", level: "N3", pattern: "～という", title: "Called / Named", short: "Introduces or explains the name or content of something.",
    explanation: "～という connects a name or quoted content to the noun that follows, meaning 'called X' or 'that says X'. It's also used to introduce information the speaker learned indirectly — one of the most frequently used connective expressions in everyday Japanese.",
    usages: [
      { title: "Naming something", examples: [
        { japanese: "「桜」という花を知っていますか。", furigana: "「さくら」というはなをしっていますか。", english: "Do you know a flower called 'sakura'?" },
        { japanese: "田中という人から電話がありました。", furigana: "たなかというひとからでんわがありました。", english: "There was a call from someone named Tanaka." },
        { japanese: "隣の家に山田さんという人が引っ越してきた。", furigana: "となりのいえにやまださんというひとがひっこしてきた。", english: "Someone named Yamada moved in next door." }
      ]},
      { title: "Reporting content", examples: [
        { japanese: "来月、新しい店ができるという話を聞きました。", furigana: "らいげつ、あたらしいみせができるというはなしをききました。", english: "I heard that a new shop is opening next month." }
      ]}
    ]
  },
  {
    id: "n3-toiukoto", level: "N3", pattern: "～ということだ", title: "I heard that / It means that", short: "Reports information heard from someone else, or restates something in other words.",
    explanation: "～ということだ attaches to a plain-form sentence to report hearsay in a slightly more formal way than そうだ, or to summarize or paraphrase what was just said — the choice of ということだ over そうだ often signals a slightly more considered, reflective tone.",
    usages: [
      { title: "Hearsay", examples: [
        { japanese: "天気予報によると、明日は晴れるということだ。", furigana: "てんきよほうによると、あしたははれるということだ。", english: "According to the forecast, it's going to be sunny tomorrow." },
        { japanese: "工事は来月まで続くということだ。", furigana: "こうじはらいげつまでつづくということだ。", english: "I've heard the construction will continue until next month." }
      ]},
      { title: "Restating / summary", examples: [
        { japanese: "つまり、彼は来ないということですね。", furigana: "つまり、かれはこないということですね。", english: "So basically, you're saying he's not coming, right?" }
      ]}
    ]
  },
  {
    id: "n3-tokoroga", level: "N3", pattern: "～ところが", title: "However / As it turned out", short: "Introduces an unexpected result that goes against what was expected.",
    explanation: "～ところが connects two sentences and signals that what happens next is a surprising or disappointing turn of events, contrary to what was expected — a stronger, more narrative-driven contrast than plain が or でも.",
    usages: [
      { title: "Unexpected turn", examples: [
        { japanese: "早く着くつもりだった。ところが、電車が遅れてしまった。", furigana: "はやくつくつもりだった。ところが、でんしゃがおくれてしまった。", english: "I intended to arrive early. However, the train was delayed." },
        { japanese: "晴れると思っていた。ところが、急に雨が降り出した。", furigana: "はれるとおもっていた。ところが、きゅうにあめがふりだした。", english: "I thought it would be sunny. But it suddenly started raining." },
        { japanese: "彼は自信満々だった。ところが、結果は散々だった。", furigana: "かれはじしんまんまんだった。ところが、けっかはさんざんだった。", english: "He was brimming with confidence. However, the result was a disaster." }
      ]}
    ]
  },
  {
    id: "n3-tokorode", level: "N3", pattern: "～ところで", title: "By the way", short: "Shifts the conversation to a new, unrelated topic.",
    explanation: "～ところで is placed at the start of a sentence to change the subject, similar to saying 'by the way' or 'incidentally' in English — a natural conversational tool for pivoting to something unrelated to what was just discussed.",
    usages: [
      { title: "Changing topic", examples: [
        { japanese: "ところで、来週の予定はもう決まりましたか。", furigana: "ところで、らいしゅうのよていはもうきまりましたか。", english: "By the way, have you decided your plans for next week yet?" },
        { japanese: "ところで、今夜の予定はどうなっていますか。", furigana: "ところで、こんやのよていはどうなっていますか。", english: "By the way, what are the plans for tonight?" }
      ]}
    ]
  },
  {
    id: "n3-tsumari", level: "N3", pattern: "～つまり", title: "In other words", short: "Restates or sums up what was just said more simply or clearly.",
    explanation: "つまり introduces a rephrasing, summary, or conclusion of what was previously said, similar to 'in other words' or 'in short'. It's useful for restating a complicated point more simply, or drawing out an implication from what was just explained.",
    usages: [
      { title: "Summarizing", examples: [
        { japanese: "彼は妹の息子です。つまり、私の甥です。", furigana: "かれはいもうとのむすこです。つまり、わたしのおいです。", english: "He is my younger sister's son. In other words, he's my nephew." },
        { japanese: "収入より支出が多い。つまり、赤字だということだ。", furigana: "しゅうにゅうよりししゅつがおおい。つまり、あかじだということだ。", english: "Expenses exceed income. In other words, we're in the red." }
      ]}
    ]
  },
  {
    id: "n3-koso", level: "N3", pattern: "～こそ", title: "Precisely / It is ... that", short: "Strongly emphasizes the word it follows, singling it out.",
    explanation: "こそ attaches to a noun to emphasize it strongly, meaning 'it is precisely this (and nothing else)'. It often appears in polite set phrases too, and can shift emphasis onto whichever word it directly follows.",
    usages: [
      { title: "Strong emphasis", examples: [
        { japanese: "今年こそ、日本語能力試験に合格したい。", furigana: "ことしこそ、にほんごのうりょくしけんにごうかくしたい。", english: "This year, of all years, I want to pass the JLPT." },
        { japanese: "こちらこそ、よろしくお願いします。", furigana: "こちらこそ、よろしくおねがいします。", english: "The pleasure is mine. (set greeting)" },
        { japanese: "今度こそ、諦めずに最後までやります。", furigana: "こんどこそ、あきらめずにさいごまでやります。", english: "This time for sure, I'll see it through without giving up." }
      ]}
    ]
  },
  {
    id: "n3-koto-wa-nai", level: "N3", pattern: "～ことはない", title: "There's no need to", short: "Reassures that an action isn't necessary.",
    explanation: "～ことはない attaches to the dictionary form of a verb and tells someone they don't need to do something, often to reassure or comfort them — it doesn't forbid the action, just removes any pressure to do it.",
    usages: [
      { title: "Reassurance", examples: [
        { japanese: "そんなに心配することはないよ。", furigana: "そんなにしんぱいすることはないよ。", english: "There's no need to worry so much." },
        { japanese: "一人で全部やることはありません。", furigana: "ひとりでぜんぶやることはありません。", english: "You don't have to do everything by yourself." },
        { japanese: "急ぐことはないから、ゆっくりでいいよ。", furigana: "いそぐことはないから、ゆっくりでいいよ。", english: "There's no need to rush, so take your time." }
      ]}
    ]
  },
  {
    id: "n3-kesshite", level: "N3", pattern: "決して～ない", title: "Never / By no means", short: "Strongly denies that something is or will ever be true.",
    explanation: "決して pairs with a negative verb form to emphatically deny something, meaning 'never' or 'under no circumstances' — it's a strong intensifier, adding real weight to a denial that plain ない alone wouldn't carry.",
    usages: [
      { title: "Strong denial", examples: [
        { japanese: "この秘密は決して誰にも言いません。", furigana: "このひみつはけっしてだれにもいいません。", english: "I will never tell this secret to anyone." },
        { japanese: "彼が嘘をつくことは決してない。", furigana: "かれがうそをつくことはけっしてない。", english: "He would never lie." },
        { japanese: "彼女は決して弱音を吐かない。", furigana: "かのじょはけっしてよわねをはかない。", english: "She never complains or shows weakness." }
      ]}
    ]
  },
  {
    id: "n3-nioite", level: "N3", pattern: "～において / ～における", title: "In / At / Regarding (formal)", short: "A formal way to mark the place, time, or field something happens in.",
    explanation: "～において (adverbial) and ～における (attributive, modifying a noun) are formal equivalents of で or に, commonly used in written and business Japanese to indicate a setting, field, or occasion — rarely heard in casual conversation, where で or に would sound more natural.",
    usages: [
      { title: "Formal setting", examples: [
        { japanese: "本日の式典は、大講堂において行われます。", furigana: "ほんじつのしきてんは、だいこうどうにおいておこなわれます。", english: "Today's ceremony will be held in the main hall." },
        { japanese: "現代社会における問題について話し合う。", furigana: "げんだいしゃかいにおけるもんだいについてはなしあう。", english: "We will discuss issues in modern society." },
        { japanese: "スポーツにおいて、努力は必ず結果に表れるとは限らない。", furigana: "スポーツにおいて、どりょくはかならずけっかにあらわれるとはかぎらない。", english: "In sports, effort doesn't necessarily always show up in the results." }
      ]}
    ]
  },
  {
    id: "n3-to-tomoni", level: "N3", pattern: "～と共に", title: "Together with / As X happens", short: "Doing something alongside someone, or one change accompanying another.",
    explanation: "～と共に means 'together with' when following a person, and 'as X happens, Y happens too' when following an event or change — a single expression covering both a literal companionship sense and a more abstract sense of parallel change.",
    usages: [
      { title: "Together with", examples: [
        { japanese: "家族と共に、新しい生活を始めた。", furigana: "かぞくとともに、あたらしいせいかつをはじめた。", english: "I started a new life together with my family." },
        { japanese: "時代の変化と共に、人々の価値観も変わってきた。", furigana: "じだいのへんかとともに、ひとびとのかちかんもかわってきた。", english: "As the times have changed, people's values have changed along with them." }
      ]},
      { title: "Accompanying change", examples: [
        { japanese: "年を取ると共に、体力が落ちてきた。", furigana: "としをとるとともに、たいりょくがおちてきた。", english: "As I've aged, my physical strength has declined." }
      ]}
    ]
  },
  {
    id: "n3-tochu", level: "N3", pattern: "～途中に / ～途中で", title: "On the way / In the middle of", short: "An action or event happens partway through another activity.",
    explanation: "～途中に／～途中で attaches to a noun + の or dictionary-form verb to describe something happening while an activity or journey is still in progress — the interruption or event occurs partway through, not at the beginning or end.",
    usages: [
      { title: "Midway through", examples: [
        { japanese: "学校へ行く途中で、財布を落としてしまった。", furigana: "がっこうへいくとちゅうで、さいふをおとしてしまった。", english: "I dropped my wallet on the way to school." },
        { japanese: "仕事の途中に、電話がかかってきた。", furigana: "しごとのとちゅうに、でんわがかかってきた。", english: "A call came in while I was in the middle of work." },
        { japanese: "映画の途中で、電話が鳴ってしまった。", furigana: "えいがのとちゅうで、でんわがなってしまった。", english: "The phone rang partway through the movie." }
      ]}
    ]
  },
  {
    id: "n3-kawari-ni", level: "N3", pattern: "～代わりに", title: "Instead of / In exchange for", short: "One thing substitutes for or compensates for another.",
    explanation: "～代わりに follows a noun or a plain-form verb and means 'instead of X' or 'in exchange for X, Y happens' — one thing substitutes for or compensates for another, whether that's a person filling in for someone or a fair trade-off.",
    usages: [
      { title: "Substitution", examples: [
        { japanese: "今日は父の代わりに、私が会議に出ます。", furigana: "きょうはちちのかわりに、わたしがかいぎにでます。", english: "Today I will attend the meeting in place of my father." },
        { japanese: "肉の代わりに、豆腐を使って料理を作った。", furigana: "にくのかわりに、とうふをつかってりょうりをつくった。", english: "I made the dish using tofu instead of meat." }
      ]},
      { title: "In exchange", examples: [
        { japanese: "家事を手伝う代わりに、お小遣いをもらった。", furigana: "かじをてつだうかわりに、おこづかいをもらった。", english: "I got an allowance in exchange for helping with housework." }
      ]}
    ]
  },
  {
    id: "n3-nazenara", level: "N3", pattern: "なぜなら～から / なぜかというと", title: "The reason is that / Because", short: "Explains the reason for a statement just made.",
    explanation: "なぜなら (usually paired with a sentence-final から) and なぜかというと both introduce an explanation for something the speaker just said, similar to starting a new sentence with 'because' in English — なぜなら reads slightly more formal and written; なぜかというと is common in speech.",
    usages: [
      { title: "Giving a reason", examples: [
        { japanese: "今日は出かけません。なぜなら、雨が降っているからです。", furigana: "きょうはでかけません。なぜなら、あめがふっているからです。", english: "I'm not going out today. The reason is, it's raining." },
        { japanese: "彼女は疲れていた。なぜかというと、昨日徹夜したからだ。", furigana: "かのじょはつかれていた。なぜかというと、きのうてつやしたからだ。", english: "She was tired. That's because she stayed up all night yesterday." },
        { japanese: "彼は試験に落ちた。なぜなら、全く勉強しなかったからだ。", furigana: "かれはしけんにおちた。なぜなら、まったくべんきょうしなかったからだ。", english: "He failed the exam. The reason is, he didn't study at all." }
      ]}
    ]
  },
  {
    id: "n3-tara-ii", level: "N3", pattern: "～たらいい / ～といい", title: "Should / I hope / It would be nice if", short: "Suggests the best course of action, or expresses a hope or wish.",
    explanation: "～たらいい (or ～といい) attaches to a conditional form and can suggest what someone should do, express a hope that something will happen, or wish for a pleasant outcome — the same conditional base covers advice, hope, and wishful thinking depending on context.",
    usages: [
      { title: "Suggestion (should)", examples: [
        { japanese: "分からない時は先生に聞いたらいいですよ。", furigana: "わからないときはせんせいにきいたらいいですよ。", english: "When you don't understand, you should ask the teacher." },
        { japanese: "困った時は誰かに相談したらいいですよ。", furigana: "こまったときはだれかにそうだんしたらいいですよ。", english: "When you're in trouble, you should talk to someone about it." }
      ]},
      { title: "Hoping", examples: [
        { japanese: "明日晴れるといいですね。", furigana: "あしたはれるといいですね。", english: "I hope it's sunny tomorrow." }
      ]},
      { title: "Wishing for something nice", examples: [
        { japanese: "早く風邪が治るといいなあ。", furigana: "はやくかぜがなおるといいなあ。", english: "I really hope my cold gets better soon." }
      ]}
    ], notes: "Compare with N4 ～たらどうですか, which is a more direct 'why don't you' suggestion; たらいい is softer and can also express personal hopes, which たらどうですか cannot."
  },
  {
    id: "n3-bai-i", level: "N3", pattern: "～ばいい", title: "Should / All you need to do is", short: "States the one thing needed to solve a problem or reach a goal.",
    explanation: "～ばいい attaches to the ば-form of a verb and suggests that doing this one thing is enough to resolve the situation — a simple, practical solution presented as sufficient on its own, without needing anything more elaborate.",
    usages: [
      { title: "Sufficient solution", examples: [
        { japanese: "分からない言葉は辞書で調べればいい。", furigana: "わからないことばはじしょでしらべればいい。", english: "If there's a word you don't understand, just look it up in the dictionary." },
        { japanese: "どこに座ればいいですか。", furigana: "どこにすわればいいですか。", english: "Where should I sit?" },
        { japanese: "分からなければ、先生に聞けばいい。", furigana: "わからなければ、せんせいにきけばいい。", english: "If you don't understand, you can just ask the teacher." }
      ]}
    ]
  },
  {
    id: "n3-nai-koto-wa-nai", level: "N3", pattern: "～ないことはない", title: "It's not that ... can't / It is possible", short: "A double negative that softens a statement into a cautious 'it's possible, but...'.",
    explanation: "～ないことはない attaches to the negative stem of a verb or adjective and means 'it's not that X is impossible', often implying reluctance or conditions attached — a cautious double negative that softens a statement without fully committing to either yes or no.",
    usages: [
      { title: "Cautious possibility", examples: [
        { japanese: "忙しいけど、手伝えないことはないです。", furigana: "いそがしいけど、てつだえないことはないです。", english: "I'm busy, but it's not that I can't help." },
        { japanese: "高いけど、買えないことはない。", furigana: "たかいけど、かえないことはない。", english: "It's expensive, but it's not impossible to buy." },
        { japanese: "難しいけど、時間があればできないことはない。", furigana: "むずかしいけど、じかんがあればできないことはない。", english: "It's difficult, but if I had time, it's not that I couldn't do it." }
      ]}
    ]
  },
  {
    id: "n3-donnani-ikura", level: "N3", pattern: "いくら～ても / どんなに～ても", title: "No matter how (much)", short: "Says that a result stays the same no matter the degree of the condition.",
    explanation: "いくら～ても and どんなに～ても both pair a degree word with ても to say that no matter how much or how X something is, the outcome won't change — いくら focuses on amount, どんなに on degree or manner, but the two are often interchangeable in practice.",
    usages: [
      { title: "No matter the amount", examples: [
        { japanese: "いくら頑張っても、うまくいかない。", furigana: "いくらがんばっても、うまくいかない。", english: "No matter how hard I try, it doesn't work out." },
        { japanese: "いくら呼んでも、犬は戻ってこなかった。", furigana: "いくらよんでも、いぬはもどってこなかった。", english: "No matter how much I called, the dog wouldn't come back." }
      ]},
      { title: "No matter the degree", examples: [
        { japanese: "どんなに疲れていても、毎日日記を書く。", furigana: "どんなにつかれていても、まいにちにっきをかく。", english: "No matter how tired I am, I write in my diary every day." }
      ]}
    ]
  },
  {
    id: "n3-hodo", level: "N3", pattern: "～ほど", title: "To the extent that / As ... as", short: "Shows the extent or degree of something by comparison.",
    explanation: "～ほど follows a noun, verb, or adjective to describe the extent of something, either through a vivid comparison or as part of a negative comparison ～ほど～ない ('not as X as'). The comparison ほど draws is often deliberately exaggerated for effect.",
    usages: [
      { title: "Degree comparison", examples: [
        { japanese: "涙が出るほど嬉しかった。", furigana: "なみだがでるほどうれしかった。", english: "I was so happy I nearly cried." },
        { japanese: "彼のスピーチは会場が静まり返るほど感動的だった。", furigana: "かれのスピーチはかいじょうがしずまりかえるほどかんどうてきだった。", english: "His speech was so moving that the whole venue fell completely silent." }
      ]},
      { title: "Negative comparison (not as ... as)", examples: [
        { japanese: "今年の冬は去年ほど寒くない。", furigana: "ことしのふゆはきょねんほどさむくない。", english: "This winter isn't as cold as last year." }
      ]}
    ]
  },
  {
    id: "n3-toiuyori", level: "N3", pattern: "～というより", title: "Rather than", short: "Corrects or refines a description by offering a more accurate alternative.",
    explanation: "～というより attaches to a plain-form phrase and says that a different description fits better than the one just mentioned, similar to 'rather than X, it's more like Y' — often used to gently correct a first impression with a more accurate one.",
    usages: [
      { title: "Correcting a description", examples: [
        { japanese: "彼は厳しいというより、真面目なんだと思う。", furigana: "かれはきびしいというより、まじめなんだとおもう。", english: "I think he's not so much strict as he is serious." },
        { japanese: "これは料理というより、芸術作品だ。", furigana: "これはりょうりというより、げいじゅつさくひんだ。", english: "This isn't so much a dish as it is a work of art." }
      ]}
    ]
  },
  {
    id: "n3-to-ittemo", level: "N3", pattern: "～といっても", title: "Although I say ... / That said", short: "Softens or qualifies a statement that might otherwise sound too strong.",
    explanation: "～といっても repeats a word or phrase just mentioned and immediately qualifies it, warning the listener not to take it too literally — a way of managing expectations right after making a claim that could otherwise sound more impressive than it is.",
    usages: [
      { title: "Qualifying a claim", examples: [
        { japanese: "日本語が話せるといっても、簡単な会話だけです。", furigana: "にほんごがはなせるといっても、かんたんなかいわだけです。", english: "Although I say I can speak Japanese, it's only simple conversation." },
        { japanese: "料理ができるといっても、簡単なものだけです。", furigana: "りょうりができるといっても、かんたんなものだけです。", english: "Although I say I can cook, it's only simple dishes." }
      ]}
    ]
  },
  {
    id: "n3-toiunoha", level: "N3", pattern: "～というのは", title: "Means that / The thing is", short: "Defines a term, or introduces the speaker's explanation for something.",
    explanation: "～というのは follows a word or phrase to introduce its definition or an explanation, similar to 'what X means is...' or 'the reason is...' — used both for genuinely defining unfamiliar terms and for explaining the reasoning behind a statement.",
    usages: [
      { title: "Defining a term", examples: [
        { japanese: "「もったいない」というのは、物を無駄にしないという意味です。", furigana: "「もったいない」というのは、ものをむだにしないといういみです。", english: "'Mottainai' means not wasting things." },
        { japanese: "彼が休んだというのは、体調が悪かったからだ。", furigana: "かれがやすんだというのは、たいちょうがわるかったからだ。", english: "The reason he was absent is that he wasn't feeling well." }
      ]},
      { title: "Explaining a reason", examples: [
        { japanese: "今日は休みます。というのは、熱があるからです。", furigana: "きょうはやすみます。というのは、ねつがあるからです。", english: "I'll take today off. The thing is, I have a fever." }
      ]}
    ]
  },
  {
    id: "n3-tositara", level: "N3", pattern: "～としたら / ～とすれば", title: "If we assume / Supposing that", short: "Sets up a hypothetical scenario to reason from.",
    explanation: "～としたら／～とすれば attaches to a plain-form sentence to introduce a hypothetical assumption, then reasons about its consequences — a way of exploring 'what if' scenarios, whether realistic or purely imaginary.",
    usages: [
      { title: "Hypothetical assumption", examples: [
        { japanese: "宝くじで一億円当たったとしたら、何がしたいですか。", furigana: "たからくじでいちおくえんあたったとしたら、なにがしたいですか。", english: "If you won 100 million yen in the lottery, what would you want to do?" },
        { japanese: "もし今日が最後の日だとしたら、何をしますか。", furigana: "もしきょうがさいごのひだとしたら、なにをしますか。", english: "If today were your last day, what would you do?" }
      ]}
    ]
  },
  {
    id: "n3-to-suru", level: "N3", pattern: "～とする", title: "Try to / Be about to", short: "Making an effort toward an action, or being on the verge of doing it.",
    explanation: "～とする attaches to the volitional form of a verb (行こうとする) to describe attempting to do something or being just about to do it — a versatile expression covering both deliberate effort and the split-second before an action begins.",
    usages: [
      { title: "Attempting", examples: [
        { japanese: "ドアを開けようとしたが、開かなかった。", furigana: "ドアをあけようとしたが、あかなかった。", english: "I tried to open the door, but it wouldn't open." },
        { japanese: "何度もダイエットをしようとしたが、続かなかった。", furigana: "なんどもダイエットをしようとしたが、つづかなかった。", english: "I tried to diet many times, but I couldn't keep it up." }
      ]},
      { title: "About to happen", examples: [
        { japanese: "ちょうど家を出ようとした時、雨が降り始めた。", furigana: "ちょうどいえをでようとしたとき、あめがふりはじめた。", english: "Just as I was about to leave the house, it started raining." }
      ]}
    ]
  },
  {
    id: "n3-nanka-nante", level: "N3", pattern: "～なんか / ～なんて", title: "Things like / Something as ... as", short: "Casually references an example, often with a dismissive or surprised tone.",
    explanation: "～なんか and ～なんて casually point to an example, often implying it's unworthy, surprising, or beneath consideration. なんて can also express surprise or exclamation on its own, without pointing to a specific dismissed example.",
    usages: [
      { title: "Dismissive example", examples: [
        { japanese: "お金なんか、いらない。", furigana: "おかねなんか、いらない。", english: "I don't need something like money." },
        { japanese: "彼が引っ越すなんて、知らなかった。", furigana: "かれがひっこすなんて、しらなかった。", english: "I had no idea he was moving!" }
      ]},
      { title: "Surprised exclamation", examples: [
        { japanese: "こんなに難しいなんて、思わなかった。", furigana: "こんなにむずかしいなんて、おもわなかった。", english: "I didn't think it would be this difficult!" }
      ]}
    ]
  },
  {
    id: "n3-narubeku", level: "N3", pattern: "なるべく", title: "As much as possible", short: "Encourages doing something to the greatest extent that's reasonably possible.",
    explanation: "なるべく is an adverb placed before a verb to mean 'as much as possible' or 'if at all possible', softer and more everyday than できるだけ — a common, gentle way to ask someone to make an effort without sounding too demanding.",
    usages: [
      { title: "Doing one's best effort", examples: [
        { japanese: "なるべく早く返事をください。", furigana: "なるべくはやくへんじをください。", english: "Please reply as soon as possible." },
        { japanese: "なるべく野菜を食べるようにしています。", furigana: "なるべくやさいをたべるようにしています。", english: "I try to eat vegetables as much as I can." },
        { japanese: "会議にはなるべく全員参加してください。", furigana: "かいぎにはなるべくぜんいんさんかしてください。", english: "Please have everyone attend the meeting if at all possible." }
      ]}
    ]
  },
  {
    id: "n3-mettani", level: "N3", pattern: "めったに～ない", title: "Rarely / Hardly ever", short: "Says that something almost never happens.",
    explanation: "めったに pairs with a negative verb to state that something happens very rarely, almost never — it's a strong statement of infrequency, stronger than あまり～ない, which just means 'not very often'.",
    usages: [
      { title: "Rare occurrence", examples: [
        { japanese: "彼はめったに怒らない。", furigana: "かれはめったにおこらない。", english: "He almost never gets angry." },
        { japanese: "こんなチャンスはめったにありません。", furigana: "こんなチャンスはめったにありません。", english: "An opportunity like this is very rare." },
        { japanese: "彼女はめったに弱音を吐かない。", furigana: "かのじょはめったによわねをはかない。", english: "She hardly ever complains or shows weakness." }
      ]}
    ]
  },
  {
    id: "n3-moshikashitara", level: "N3", pattern: "もしかしたら～かもしれない", title: "Perhaps / Maybe", short: "Introduces a tentative guess or possibility.",
    explanation: "もしかしたら often pairs with かもしれない at the end of the sentence to soften a guess, meaning 'perhaps' or 'by any chance' — it signals right from the start of the sentence that an uncertain possibility is being floated.",
    usages: [
      { title: "Tentative guess", examples: [
        { japanese: "もしかしたら、明日は雪が降るかもしれない。", furigana: "もしかしたら、あしたはゆきがふるかもしれない。", english: "It might possibly snow tomorrow." },
        { japanese: "もしかしたら、彼はもう知っているかもしれない。", furigana: "もしかしたら、かれはもうしっているかもしれない。", english: "He might already know, by any chance." }
      ]}
    ]
  },
  {
    id: "n3-mono-reason", level: "N3", pattern: "～もの / ～もん", title: "Because ... (giving an excuse)", short: "A casual, often defensive way to give a reason.",
    explanation: "～もの (casual もん) attaches to the end of a plain sentence to give a reason in a slightly defensive or explanatory tone, common in casual speech — it often has a childish or pouty flavor, and is used more by women and children in stereotypical speech patterns, though anyone can use it casually.",
    usages: [
      { title: "Casual excuse", examples: [
        { japanese: "「なんで食べないの？」「だって、嫌いなんだもの。」", furigana: "「なんでたべないの？」「だって、きらいなんだもの。」", english: "\"Why aren't you eating it?\" \"Because I don't like it!\"" },
        { japanese: "「なぜ来なかったの？」「だって、忙しかったんだもの。」", furigana: "「なぜこなかったの？」「だって、いそがしかったんだもの。」", english: "\"Why didn't you come?\" \"Because I was busy!\"" }
      ]}
    ]
  },
  {
    id: "n3-youna-ki-ga-suru", level: "N3", pattern: "～ような気がする", title: "I have a feeling that", short: "Expresses an intuition or vague impression, without full certainty.",
    explanation: "～ような気がする attaches to a plain-form sentence to express a feeling or hunch that something is the case, without being fully sure — a gentle, hedged way of stating an intuition rather than a firm conclusion.",
    usages: [
      { title: "Vague impression", examples: [
        { japanese: "前にどこかで会ったような気がする。", furigana: "まえにどこかであったようなきがする。", english: "I have a feeling we've met somewhere before." },
        { japanese: "何か忘れ物をしたような気がする。", furigana: "なにかわすれものをしたようなきがする。", english: "I have a feeling I forgot something." }
      ]}
    ]
  },
  {
    id: "n3-bakari-de-naku", level: "N3", pattern: "～ばかりでなく", title: "Not only ... but also", short: "A more formal alternative to だけでなく for adding extra information.",
    explanation: "～ばかりでなく connects two clauses to say that something is not limited to the first point but extends to a second, often more surprising, one — functionally close to だけでなく, with a slightly more formal or written flavor.",
    usages: [
      { title: "Adding more", examples: [
        { japanese: "この店はケーキばかりでなく、パンも美味しい。", furigana: "このみせはケーキばかりでなく、パンもおいしい。", english: "This shop's cakes aren't the only good thing — the bread is delicious too." },
        { japanese: "この薬は風邪ばかりでなく、頭痛にも効く。", furigana: "このくすりはかぜばかりでなく、ずつうにもきく。", english: "This medicine works not only for colds but for headaches too." }
      ]}
    ]
  },
  {
    id: "n3-betsuni", level: "N3", pattern: "別に～ない", title: "Not really / Not particularly", short: "Downplays or denies that something is special or a big deal.",
    explanation: "別に pairs with a negative predicate to mean 'not particularly' or 'not really', often used to sound indifferent or dismissive — a very common conversational filler for downplaying interest, feelings, or objections.",
    usages: [
      { title: "Downplaying", examples: [
        { japanese: "「疲れた？」「別に。」", furigana: "「つかれた？」「べつに。」", english: "\"Tired?\" \"Not really.\"" },
        { japanese: "別に怒っていません。", furigana: "べつにおこっていません。", english: "I'm not particularly angry." },
        { japanese: "別に彼のことを気にしているわけではない。", furigana: "べつにかれのことをきにしているわけではない。", english: "It's not like I'm particularly worried about him or anything." }
      ]}
    ]
  },
  {
    id: "n3-nikakete", level: "N3", pattern: "～にかけて", title: "Over / Through (a span)", short: "Describes something spanning a range of time or place.",
    explanation: "～にかけて follows a starting point (often paired with から) and a noun of time or place to describe an event spreading across that whole range — the event isn't confined to one moment or spot, but stretches continuously across the stated span.",
    usages: [
      { title: "Spanning a period", examples: [
        { japanese: "九月から十月にかけて、台風が多い。", furigana: "くがつからじゅうがつにかけて、たいふうがおおい。", english: "There are many typhoons from September through October." },
        { japanese: "この地方は春から夏にかけて、雨が多い。", furigana: "このちほうははるからなつにかけて、あめがおおい。", english: "This region gets a lot of rain from spring through summer." }
      ]}
    ]
  },
  {
    id: "n3-nikawatte", level: "N3", pattern: "～にかわって / ～にかわり", title: "On behalf of / In place of", short: "Someone or something stands in for another.",
    explanation: "～にかわって follows a noun (usually a person) and means acting in that person's place, often because they are unavailable — the substitute takes on the role or duty that would otherwise belong to the named person.",
    usages: [
      { title: "Acting on someone's behalf", examples: [
        { japanese: "社長にかわって、私がご挨拶いたします。", furigana: "しゃちょうにかわって、わたしがごあいさついたします。", english: "I will give the greeting on behalf of the president." },
        { japanese: "入院した父にかわって、私が店を手伝っている。", furigana: "にゅういんしたちちにかわって、わたしがみせをてつだっている。", english: "In place of my hospitalized father, I'm helping run the shop." }
      ]}
    ]
  },
  {
    id: "n3-kiru", level: "N3", pattern: "～きる / ～きれない", title: "Completely / Too much to finish", short: "Doing something entirely to its conclusion, or being unable to finish it all.",
    explanation: "～きる attaches to the verb stem to emphasize completing an action fully. Its negative-potential form ～きれない means there's too much of something to fully complete the action — one form for full completion, the other for an amount too large to finish.",
    usages: [
      { title: "Complete completion", examples: [
        { japanese: "マラソンを最後まで走りきった。", furigana: "マラソンをさいごまではしりきった。", english: "I ran the marathon all the way to the end." },
        { japanese: "彼は自分の考えを言い切った。", furigana: "かれはじぶんのかんがえをいいきった。", english: "He stated his opinion outright, all the way through." }
      ]},
      { title: "Too much to finish", examples: [
        { japanese: "こんなにたくさん食べきれません。", furigana: "こんなにたくさんたべきれません。", english: "I can't possibly eat all of this." }
      ]}
    ]
  },
  {
    id: "n3-ippouda", level: "N3", pattern: "～一方だ", title: "Only getting more / Continuing to", short: "A trend keeps moving in one direction without stopping.",
    explanation: "～一方だ attaches to the dictionary form of a change verb and says that a trend keeps intensifying in a single direction, often negatively — the change shows no sign of slowing down or reversing.",
    usages: [
      { title: "One-directional trend", examples: [
        { japanese: "若者の人口は減る一方だ。", furigana: "わかもののじんこうはへるいっぽうだ。", english: "The young population just keeps decreasing." },
        { japanese: "物価は上がる一方だ。", furigana: "ぶっかはあがるいっぽうだ。", english: "Prices just keep rising." }
      ]}
    ]
  },
  {
    id: "n3-ippoude", level: "N3", pattern: "～一方で", title: "On the other hand / While also", short: "Presents a second, contrasting fact alongside the first.",
    explanation: "～一方で connects two clauses to show two different or contrasting sides of the same subject — often used to give a balanced view, acknowledging both an upside and a downside within a single statement.",
    usages: [
      { title: "Contrasting sides", examples: [
        { japanese: "この薬はよく効く一方で、副作用も強い。", furigana: "このくすりはよくきくいっぽうで、ふくさようもつよい。", english: "This medicine works well, but on the other hand, its side effects are also strong." },
        { japanese: "都会は便利な一方で、生活費が高い。", furigana: "とかいはべんりないっぽうで、せいかつひがたかい。", english: "The city is convenient, but on the other hand, the cost of living is high." }
      ]}
    ]
  },
  {
    id: "n3-sono-kekka", level: "N3", pattern: "その結果 / ～た結果", title: "As a result", short: "Introduces the outcome that followed from what was just described.",
    explanation: "その結果 begins a new sentence to state an outcome. ～た結果 attaches directly to a past-tense verb or noun + の to mean 'as a result of doing X' — both point to a cause-and-effect relationship, one as a sentence connector and one attached directly to the cause.",
    usages: [
      { title: "Stating an outcome", examples: [
        { japanese: "毎日練習した。その結果、大会で優勝した。", furigana: "まいにちれんしゅうした。そのけっか、たいかいでゆうしょうした。", english: "I practiced every day. As a result, I won the tournament." },
        { japanese: "話し合った結果、旅行は中止することにした。", furigana: "はなしあったけっか、りょこうはちゅうしすることにした。", english: "As a result of discussing it, we decided to cancel the trip." },
        { japanese: "長年の努力の結果、ついに目標を達成した。", furigana: "ながねんのどりょくのけっか、ついにもくひょうをたっせいした。", english: "As a result of years of effort, I finally achieved my goal." }
      ]}
    ]
  },
  {
    id: "n3-koto-ka", level: "N3", pattern: "～ことか", title: "How ...! / What a ...!", short: "An exclamation expressing strong emotion about the extent of something.",
    explanation: "～ことか attaches to a な-adjective/い-adjective or plain verb to make an emotional exclamation about the degree of something, similar to 'how X it is!' — it's rhetorical, not a real question, and always carries strong feeling.",
    usages: [
      { title: "Emotional exclamation", examples: [
        { japanese: "あの日から、どんなに心配したことか。", furigana: "あのひから、どんなにしんぱいしたことか。", english: "You have no idea how worried I've been since that day." },
        { japanese: "この景色は何と美しいことか。", furigana: "このけしきはなんとうつくしいことか。", english: "How beautiful this scenery is!" }
      ]}
    ]
  },
  {
    id: "n3-koto-imperative", level: "N3", pattern: "～こと（命令）", title: "Must / Be sure to (written rule)", short: "A written instruction or rule phrased as a soft command.",
    explanation: "Attaching こと to the plain form of a verb creates a formal, impersonal instruction often seen in rules, notices, and exam instructions — it reads as a written directive rather than something a person would say aloud to another person directly.",
    usages: [
      { title: "Written rule", examples: [
        { japanese: "教室では静かにすること。", furigana: "きょうしつではしずかにすること。", english: "Be quiet in the classroom. (posted rule)" },
        { japanese: "忘れ物をしないこと。", furigana: "わすれものをしないこと。", english: "Do not forget your belongings." },
        { japanese: "使用後は、必ず電源を切ること。", furigana: "しようごは、かならずでんげんをきること。", english: "Be sure to turn off the power after use." }
      ]}
    ]
  },
  {
    id: "n3-kotoni", level: "N3", pattern: "～ことに", title: "To my (surprise / relief / etc.)", short: "Expresses the speaker's emotional reaction before stating the fact.",
    explanation: "～ことに attaches to an emotional な-adjective or verb (驚いた, 嬉しい, 残念な) at the start of a sentence to color the fact that follows with that feeling — the emotional word comes first, framing how the reader or listener should feel about what's coming.",
    usages: [
      { title: "Emotional framing", examples: [
        { japanese: "驚いたことに、彼は一日で終わらせた。", furigana: "おどろいたことに、かれはいちにちでおわらせた。", english: "To my surprise, he finished it in one day." },
        { japanese: "残念なことに、旅行は中止になった。", furigana: "ざんねんなことに、りょこうはちゅうしになった。", english: "Unfortunately, the trip was cancelled." },
        { japanese: "嬉しいことに、探していた本が見つかった。", furigana: "うれしいことに、さがしていたほんがみつかった。", english: "To my delight, I found the book I'd been looking for." }
      ]}
    ]
  },
  {
    id: "n3-temo-kamawanai", level: "N3", pattern: "～てもかまわない", title: "It's fine even if / I don't mind", short: "A relaxed way to give or ask for permission.",
    explanation: "～てもかまわない is similar to ～てもいい but slightly more relaxed in tone, meaning 'it doesn't matter even if...' or 'I don't mind if...' — often used to reassure someone that a minor deviation from the norm is perfectly fine.",
    usages: [
      { title: "Relaxed permission", examples: [
        { japanese: "少し遅れてもかまいません。", furigana: "すこしおくれてもかまいません。", english: "It's fine even if you're a little late." },
        { japanese: "ここに座ってもかまいませんか。", furigana: "ここにすわってもかまいませんか。", english: "Would it be alright if I sat here?" },
        { japanese: "写真を撮ってもかまいませんか。", furigana: "しゃしんをとってもかまいませんか。", english: "Would it be alright if I took a photo?" }
      ]}
    ]
  }
];

const N2_GRAMMAR = [
  {
    id: "n2-koto-kara", level: "N2", pattern: "～ことから", title: "From the fact that / because", short: "States the reason or origin for a judgment, name, or situation.",
    explanation: "～ことから attaches to a plain-form clause and gives the specific fact, detail, or clue that led to a conclusion or naming — 'from the fact that X, ...'. It's often used to explain where a nickname, name, or judgment originally came from.",
    usages: [
      { title: "Origin of a name or fact", examples: [
        { japanese: "富士山が見えることから、この町は富士見町と呼ばれる。", furigana: "ふじさんがみえることから、このまちはふじみちょうとよばれる。", english: "Because Mt. Fuji can be seen from here, this town is called Fujimi-cho." },
        { japanese: "彼が疲れていることから、無理をさせないほうがいい。", furigana: "かれがつかれていることから、むりをさせないほうがいい。", english: "From the fact that he's tired, it's better not to push him." },
        { japanese: "顔が赤いことから、酒を飲んだのだと分かった。", furigana: "かおがあかいことから、さけをのんだのだとわかった。", english: "From the fact that his face was red, I could tell he'd been drinking." }
      ]}
    ]
  },
  {
    id: "n2-ni-soote", level: "N2", pattern: "～に沿って / ～に沿う", title: "Along / in line with", short: "Action follows a line, course, guidelines, or plan.",
    explanation: "～に沿って follows a noun describing a line, plan, or set of guidelines, and means proceeding in a way that stays aligned with it — literally 'along' a river or road, and figuratively 'in line with' a policy or someone's wishes.",
    usages: [
      { title: "In accordance with a plan", examples: [
        { japanese: "計画に沿って進めましょう。", furigana: "けいかくにそってすすめましょう。", english: "Let's proceed in line with the plan." },
        { japanese: "ガイドラインに沿って行動してください。", furigana: "ガイドラインにそってこうどうしてください。", english: "Please act in accordance with the guidelines." },
        { japanese: "お客様のご希望に沿って、プランを作成いたします。", furigana: "おきゃくさまのごきぼうにそって、プランをさくせいいたします。", english: "We will create the plan in line with the customer's wishes." }
      ]}
    ]
  },
  {
    id: "n2-ni-kanau", level: "N2", pattern: "～に基づいて / ～に基づく", title: "Based on / on the basis of", short: "Takes data, research, or principles as a foundation.",
    explanation: "～に基づいて follows a noun describing a source (data, a law, an original work) and means that what follows is grounded in, or derived from, that basis. It's the standard expression for citing evidence, legal grounds, or source material in formal and academic writing.",
    usages: [
      { title: "Foundation", examples: [
        { japanese: "調査結果に基づいて報告書を作成しました。", furigana: "ちょうさけっかにもとづいてほうこくしょをさくせいしました。", english: "I created the report based on the survey results." },
        { japanese: "事実に基づいた判断をしなければならない。", furigana: "じじつにもとづいたはんだんをしなければならない。", english: "You must make judgments based on facts." },
        { japanese: "この映画は実話に基づいて作られている。", furigana: "このえいがはじつわにもとづいてつくられている。", english: "This movie is made based on a true story." }
      ]}
    ]
  },
  {
    id: "n2-ni-pukate", level: "N2", pattern: "～のもとで / ～のもとに", title: "Under the leadership/condition of", short: "Describes an action taking place under someone's guidance or specific conditions.",
    explanation: "～のもとで and ～のもとに both follow a noun describing an influence, authority, or set of conditions, meaning 'under X' — under someone's guidance, under a given set of circumstances, or under an agreement. のもとで leans slightly more toward describing sustained guidance or supervision; のもとに is often used for a condition or agreement something is built on.",
    usages: [
      { title: "Under guidance", examples: [
        { japanese: "名コーチのもとで練習に励んだ。", furigana: "めいコーチのもとでれんしゅうにはげんだ。", english: "I trained hard under a famous coach." },
        { japanese: "自由のもとで、意見を述べた。", furigana: "じゆうのもとで、いけんをのべた。", english: "I expressed my opinion under freedom." },
        { japanese: "両者は合意のもとに契約を結んだ。", furigana: "りょうしゃはごういのもとにけいやくをむすんだ。", english: "The two parties signed the contract under a mutual agreement." }
      ]}
    ]
  },
  {
    id: "n2-kiri", level: "N2", pattern: "～きり", title: "Ever since / only", short: "An action was done once, and that state has continued without change ever since.",
    explanation: "～きり has two closely related uses. Attached to a noun or verb, it means 'only' or 'just', similar to だけ but often implying a certain smallness or limitation (二人きり, 'just the two of us'). Attached to a past-tense verb, it means 'ever since', implying that nothing has happened since that point — 会ったきり会っていない ('haven't seen them since we met').",
    usages: [
      { title: "Continued state after action", examples: [
        { japanese: "彼とは去年会ったきり、連絡を取っていない。", furigana: "かれとはきょねんあったきり、れんらくをとっていない。", english: "Ever since I met him last year, I haven't been in touch." },
        { japanese: "電話をかけたきり、まだ返事がない。", furigana: "でんわをかけたきり、まだへんじがない。", english: "I haven't heard back since I made that call." }
      ]},
      { title: "Only", examples: [
        { japanese: "二人きりで話し合った。", furigana: "ふたりきりではなしあった。", english: "We talked alone, just the two of us." }
      ]}
    ]
  },
  {
    id: "n2-pukari-ni", level: "N2", pattern: "～あまり（に）", title: "So much that / excessive", short: "An extreme degree of emotion or state causes an unintended or negative result.",
    explanation: "～あまり（に）follows a noun or the plain form of a verb/adjective and means that something happened as a result of a feeling or state being so extreme that it led to an excessive or unusual outcome — 'from too much X, ...'. It differs from あまり～ない (which just means 'not very'); this あまり is a noun meaning 'excess' and always points to a consequence.",
    usages: [
      { title: "Excessive emotion", examples: [
        { japanese: "嬉しさのあまり、涙が出てしまった。", furigana: "うれしさのあまり、なみだがでてしまった。", english: "In my overwhelming joy, tears came to my eyes." },
        { japanese: "驚きのあまり、言葉が出なかった。", furigana: "おどろきのあまり、ことばがでなかった。", english: "I was so surprised that I couldn't speak." },
        { japanese: "驚きのあまり、声も出なかった。", furigana: "おどろきのあまり、こえもでなかった。", english: "I was so surprised that I couldn't even make a sound." }
      ]}
    ]
  },
  {
    id: "n2-upon-tatanai", level: "N2", pattern: "～わけがない", title: "There is no reason why / impossible that", short: "Strong logical denial based on objective conviction.",
    explanation: "～わけがない attaches to a plain-form phrase and firmly denies that something is possible, based on the speaker's confident reasoning — 'there's no way X could be true'. It's a stronger, more assertive denial than 〜ないだろう or 〜はずがない's milder cousin.",
    usages: [
      { title: "Strong logical denial", examples: [
        { japanese: "そんな難しい問題が一人で解けるわけがない。", furigana: "そんなむずかしいもんだいがひとりでとけるわけがない。", english: "There is no way you can solve such a difficult problem alone." },
        { japanese: "彼がそんなことをするわけがない。", furigana: "かれがそんなことをするわけがない。", english: "There's no way he would do such a thing." },
        { japanese: "こんな複雑な問題、子供に解けるわけがない。", furigana: "こんなふくざつなもんだい、こどもにとけるわけがない。", english: "There's no way a child could solve a problem this complicated." }
      ]}
    ]
  },
  {
    id: "n2-wake-niwa-ikani", level: "N2", pattern: "～わけにはいかない", title: "Cannot afford to / must not (due to social/moral reasons)", short: "Inability to do something due to psychological, social, or ethical constraints.",
    explanation: "～わけにはいかない attaches to the dictionary form of a verb and means that, despite personal wishes, a social, moral, or practical obligation makes an action impossible to take — 'I can't just do X (even though I might want to)'. The negative form ～ないわけにはいかない flips this into 'I have no choice but to do X'.",
    usages: [
      { title: "Moral/Social constraint", examples: [
        { japanese: "大事な会議があるから、休むわけにはいかない。", furigana: "だいじなかいぎがあるから、やすむわけにはいかない。", english: "I have an important meeting, so I cannot afford to take the day off." },
        { japanese: "約束した以上、行かないわけにはいかない。", furigana: "やくそくしたいじょう、いかないわけにはいかない。", english: "Since I promised, I can't not go." },
        { japanese: "約束したのだから、行かないわけにはいかない。", furigana: "やくそくしたのだから、いかないわけにはいかない。", english: "I promised, so I have no choice but to go." }
      ]}
    ]
  },
  {
    id: "n2-ni-kanarazu", level: "N2", pattern: "～ざるを得ない", title: "Cannot help but / forced to", short: "Have no choice but to do an action despite not wanting to.",
    explanation: "～ざるを得ない attaches to the negative stem of a verb (using the classical ざる instead of ない) and means someone is forced into an action against their preference, because the circumstances leave no real alternative — a formal, slightly literary equivalent of ～なければならない with a stronger sense of reluctant compulsion.",
    usages: [
      { title: "Involuntary necessity", examples: [
        { japanese: "証拠がある以上、罪を認めざるを得ない。", furigana: "しょうこがあるいじょう、つみをみとめざるをえない。", english: "Given that there is evidence, I have no choice but to admit guilt." },
        { japanese: "雨が強いので、中止せざるを得ない。", furigana: "あめがつよいので、ちゅうしせざるをえない。", english: "Since the rain is heavy, we have no choice but to cancel." },
        { japanese: "台風のため、旅行を中止せざるを得なかった。", furigana: "たいふうのため、りょこうをちゅうしせざるをえなかった。", english: "Because of the typhoon, we had no choice but to cancel the trip." }
      ]}
    ]
  },
  {
    id: "n2-kabon", level: "N2", pattern: "～かねる", title: "Cannot / unable to (polite refusal)", short: "Used in formal or business contexts to politely decline or state inability.",
    explanation: "～かねる attaches to the ます-stem of a verb and is a polite, formal way to say that doing something is difficult or not possible — commonly used by staff and businesses to soften a refusal (お答えしかねます, 'I'm afraid I can't answer that'). It's much gentler and more indirect than a flat できません.",
    usages: [
      { title: "Polite hesitation/refusal", examples: [
        { japanese: "そのご質問にはお答えかねます。", furigana: "そのごしつもんにはおこたえかねます。", english: "I am unable to answer that question." },
        { japanese: "ご希望に沿いかねます。", furigana: "ごきぼうにそいかねます。", english: "We are unable to meet your request." },
        { japanese: "その件については、私からはお答えしかねます。", furigana: "そのけんについては、わたしからはおこたえしかねます。", english: "I'm afraid I'm not in a position to answer that matter." }
      ]}
    ]
  },
  {
    id: "n2-kanenai", level: "N2", pattern: "～かねない", title: "Might very well / run the risk of", short: "Expresses anxiety that a negative outcome could easily happen.",
    explanation: "～かねない attaches to the ます-stem of a verb and warns that something bad, while not certain, is a real and plausible risk — 'might well happen' or 'could end up happening'. It's almost always used about negative outcomes, unlike plain かもしれない which is neutral.",
    usages: [
      { title: "Warning of risk", examples: [
        { japanese: "このまま放置すれば、大事故につながりかねない。", furigana: "このままほうちすれば、だいじこにつながりかねない。", english: "If left as is, it could well lead to a major accident." },
        { japanese: "彼は約束を忘れかねない人だ。", furigana: "かれはやくそくをわすれかねないひとだ。", english: "He's the kind of person who could easily forget a promise." },
        { japanese: "そんな運転をしていたら、事故を起こしかねない。", furigana: "そんなうんてんをしていたら、じこをおこしかねない。", english: "Driving like that, you could well end up causing an accident." }
      ]}
    ]
  },
  {
    id: "n2-ni-kagirazui", level: "N2", pattern: "～に限らず", title: "Not limited to... but also", short: "Extends a condition beyond a specific noun to broader categories.",
    explanation: "～に限らず follows a noun and means 'not limited to X' — the statement applies more broadly than just the one case named, extending the scope to other, often unstated, examples as well.",
    usages: [
      { title: "Broader scope", examples: [
        { japanese: "男性に限らず、女性もそのイベントに参加できる。", furigana: "だんせいにかぎらず、じょせいもそのイベントにさんかできる。", english: "Not limited to men, women can also participate in the event." },
        { japanese: "学生に限らず、誰でも応募できる。", furigana: "がくせいにかぎらず、だれでもおうぼできる。", english: "Not limited to students, anyone can apply." },
        { japanese: "この問題は日本に限らず、世界中で起きている。", furigana: "このもんだいはにほんにかぎらず、せかいじゅうでおきている。", english: "This problem isn't limited to Japan — it's happening around the world." }
      ]}
    ]
  },
  {
    id: "n2-ni-kaito", level: "N2", pattern: "～に限って", title: "Only / particularly when", short: "Focuses on a specific timing or entity that creates an unfortunate coincidence or special case.",
    explanation: "～に限って follows a noun and singles it out as an exception to a general rule, often with an ironic or frustrated tone — 'it's exactly when/with X that (something inconvenient happens)'. A common set phrase is 忙しい時に限って ('it's always when I'm busy that...').",
    usages: [
      { title: "Unfortunate timing", examples: [
        { japanese: "傘を持っていない日に限って、雨が降る。", furigana: "かさをもっていないひにかぎって、あめがふる。", english: "It rains particularly on days when I don't have an umbrella." },
        { japanese: "急いでいる時に限って、電車が遅れる。", furigana: "いそいでいるときにかぎって、でんしゃがおくれる。", english: "It's exactly when I'm in a hurry that the train runs late." }
      ]},
      { title: "Special case", examples: [
        { japanese: "彼に限ってそんなことはしない。", furigana: "かれにかぎってそんなことはしない。", english: "He, of all people, wouldn't do such a thing." }
      ]}
    ]
  },
  {
    id: "n2-ni-kagirareta", level: "N2", pattern: "～に限る", title: "X is the best / nothing beats X", short: "Expresses a subjective opinion that a certain choice is the absolute best option.",
    explanation: "～に限る follows a noun or verb and means 'X is the best' or 'nothing beats X' — a casual, confident recommendation, often used about food, activities, or ways to spend time (夏はビールに限る, 'summer calls for beer').",
    usages: [
      { title: "Best option", examples: [
        { japanese: "寒い日は温かい鍋を食べるに限る。", furigana: "さむいひはあたたかいなべをたべるにかぎる。", english: "On cold days, nothing beats eating hot pot." },
        { japanese: "疲れた時は寝るに限る。", furigana: "つかれたときはねるにかぎる。", english: "When you're tired, sleeping is the best." },
        { japanese: "疲れた時は、温泉に入るに限る。", furigana: "つかれたときは、おんせんにはいるにかぎる。", english: "When you're tired, nothing beats soaking in a hot spring." }
      ]}
    ]
  },
  {
    id: "n2-furo-hantai", level: "N2", pattern: "～に反して / ～に反する", title: "Contrary to / against", short: "Results or actions go completely counter to expectations, rules, or desires.",
    explanation: "～に反して follows a noun (予想, 期待, 規則) and means something happens contrary to it — an outcome opposite of what was expected, or an action that violates a rule. It's a formal expression common in news reporting and official writing.",
    usages: [
      { title: "Contrary outcome", examples: [
        { japanese: "予想に反して、試験はとても簡単だった。", furigana: "よそうにはんして、しけんはとてもかんたんだった。", english: "Contrary to expectations, the exam was very easy." },
        { japanese: "規則に反する行動をした。", furigana: "きそくにはんするこうどうをした。", english: "I acted against the rules." },
        { japanese: "規則に反して、無断で欠席した。", furigana: "きそくにはんして、むだんでけっせきした。", english: "In violation of the rules, he was absent without notice." }
      ]}
    ]
  },
  {
    id: "n2-poi-koto", level: "N2", pattern: "～っこない", title: "No chance that / definitely cannot", short: "Strong casual denial of possibility or capability.",
    explanation: "～っこない is a casual, spoken contraction meaning 'there's absolutely no way X will happen' — a firm, colloquial denial with a slightly dismissive or exasperated tone, more at home in everyday conversation than わけがない or はずがない.",
    usages: [
      { title: "Casual strong denial", examples: [
        { japanese: "一日でこの本を全部読み切れっこない。", furigana: "ついたちでこのほんをぜんぶよみきれっこない。", english: "There's no way I can finish reading this whole book in one day." },
        { japanese: "そんなことは絶対にありっこない。", furigana: "そんなことはぜったいにありっこない。", english: "There's absolutely no way that could happen." },
        { japanese: "こんな量、一人で食べられっこない。", furigana: "こんなりょう、ひとりでたべられっこない。", english: "There's no way I could eat this much by myself." }
      ]}
    ]
  },
  {
    id: "n2-saichuu", level: "N2", pattern: "～最中に / ～最中だ", title: "Right in the middle of", short: "An unexpected disruption occurs exactly during the peak of an action.",
    explanation: "～最中に marks the exact moment something else happens right in the middle of an ongoing action — an interruption arriving at the peak or busiest point of another activity. ～最中だ, without に, simply states that something is currently at its peak or in full swing.",
    usages: [
      { title: "Interrupted action", examples: [
        { japanese: "食事の最中に電話がかかってきた。", furigana: "しょくじのさいちゅうにでんわがかかってきた。", english: "A phone call came right in the middle of my meal." },
        { japanese: "会議の最中で、出られなかった。", furigana: "かいぎのさいちゅうで、でられなかった。", english: "I was in the middle of a meeting and couldn't leave." },
        { japanese: "今、会議の最中です。後でかけ直します。", furigana: "いま、かいぎのさいちゅうです。あとでかけなおします。", english: "I'm right in the middle of a meeting right now. I'll call you back later." }
      ]}
    ]
  },
  {
    id: "n2-sode-mo-nai", level: "N2", pattern: "～そうにない / ～そうもない", title: "Unlikely to / shows no sign of", short: "Expresses that an action seems highly improbable based on current appearance.",
    explanation: "～そうにない (or ～そうもない) attaches to the ます-stem of a verb and means there's little to no visible sign that something will happen — the outward appearance strongly suggests the opposite of what was hoped for or expected.",
    usages: [
      { title: "Improbability based on observation", examples: [
        { japanese: "雨はやみそうもありません。", furigana: "あめはやみそうもありません。", english: "It doesn't look like the rain is going to stop anytime soon." },
        { japanese: "彼は来そうにない。", furigana: "かれはきそうにない。", english: "He doesn't look like he's coming." },
        { japanese: "この様子では、締め切りまでに終わりそうにない。", furigana: "このようすでは、しめきりまでにおわりそうにない。", english: "At this rate, it doesn't look like we'll finish by the deadline." }
      ]}
    ]
  },
  {
    id: "n2-te-kara-koto", level: "N2", pattern: "～て以来", title: "Ever since", short: "A state has continued continuously since a past action took place.",
    explanation: "～て以来 attaches to the て-form of a verb and marks a point in the past after which a described state has continued uninterrupted up to now — 'ever since X, ...'. It's commonly followed by ずっと to reinforce the sense of an unbroken continuation.",
    usages: [
      { title: "Continuous state", examples: [
        { japanese: "卒業して以来、彼には一度も会っていない。", furigana: "そつぎょうしていらい、かれにはいちどもあっていない。", english: "Ever since graduating, I haven't met him even once." },
        { japanese: "日本に来て以来、ずっと忙しい。", furigana: "にほんにきていらい、ずっといそがしい。", english: "Ever since coming to Japan, I've been busy." },
        { japanese: "彼と別れて以来、一度も連絡を取っていない。", furigana: "かれとわかれていらい、いちどもれんらくをとっていない。", english: "I haven't contacted him even once since we broke up." }
      ]}
    ]
  },
  {
    id: "n2-te-shoudai", level: "N2", pattern: "～てたまらない / ～て仕方がない", title: "Can't stand / irresistibly", short: "An emotion, desire, or physical sensation is so strong it cannot be controlled.",
    explanation: "～てたまらない and ～て仕方がない both attach to the て-form of an emotion or sensation word and mean a feeling has become so intense it's unbearable to hold back — 'I can't stand how X I feel' or 'I'm dying of X'. て仕方がない is slightly more casual and conversational than てたまらない.",
    usages: [
      { title: "Uncontrollable feeling", examples: [
        { japanese: "合格したかどうか気になってたまらない。", furigana: "ごうかくしたかどうかきになってたまらない。", english: "I am dying to know whether I passed or not." },
        { japanese: "その映画がどうしても見たくてたまらない。", furigana: "そのえいががどうしてもみたくてたまらない。", english: "I can't help wanting to see that movie." },
        { japanese: "彼の態度が気になって仕方がない。", furigana: "かれのたいどがきになってしかたがない。", english: "I can't stop worrying about his attitude." }
      ]}
    ]
  },
  {
    id: "n2-to-dou-shi", level: "N2", pattern: "～と同時に", title: "At the same time as / simultaneously", short: "Two actions or states exist or occur at the exact same moment.",
    explanation: "～と同時に follows a noun or the dictionary form of a verb and means 'at the same time as X' — describing two events that happen simultaneously, or, more abstractly, two facts or qualities that are both true of the same thing at once.",
    usages: [
      { title: "Simultaneous events", examples: [
        { japanese: "ドアが開くと同時に、客が雪崩れ込んだ。", furigana: "ドアがあくとどうじに、きゃくがなだれこんだ。", english: "As soon as the door opened, customers rushed in." },
        { japanese: "彼は学生であると同時に、会社の社長でもある。", furigana: "かれはがくせいであるとどうじに、かいしゃのしゃちょうでもある。", english: "He is at once a student and a company president." },
        { japanese: "彼は医者であると同時に、大学で教えてもいる。", furigana: "かれはいしゃであるとどうじに、だいがくでおしえてもいる。", english: "He is a doctor, and at the same time, he also teaches at a university." }
      ]}
    ]
  },
  {
    id: "n2-to-tomo-ni", level: "N2", pattern: "～とともに", title: "Together with / as X changes, Y changes", short: "Describes companion actions or parallel gradual transformations.",
    explanation: "～とともに means 'together with X' when following a person, and 'as X happens, Y happens too' when following an event or change — the same core dual meaning as N3's と共に, but at a slightly more formal register common in written Japanese.",
    usages: [
      { title: "Parallel change", examples: [
        { japanese: "時代の変化とともに、言葉の意味も変わる。", furigana: "じだいのへんかとともに、ことばのいみもかわる。", english: "As times change, the meanings of words change as well." },
        { japanese: "友達とともに、そのプロジェクトを始めた。", furigana: "ともだちとともに、そのプロジェクトをはじめた。", english: "I started that project together with my friend." },
        { japanese: "技術の発展とともに、生活は便利になった。", furigana: "ぎじゅつのはってんとともに、せいかつはべんりになった。", english: "As technology developed, life became more convenient." }
      ]}
    ]
  },
  {
    id: "n2-toshite-mo", level: "N2", pattern: "～としても / ～としたら", title: "Even assuming that / if we suppose", short: "Sets up a hypothetical scenario or concession.",
    explanation: "～としても attaches to a plain-form phrase and means 'even granting that X is true, ...' — a concessive that acknowledges a hypothetical or actual fact before showing it doesn't change the conclusion. ～としたら sets up a more open hypothetical, closer to 'if we assume that X, ...'.",
    usages: [
      { title: "Hypothetical scenario", examples: [
        { japanese: "本当だとしても、信じられない。", furigana: "ほんとうだとしても、しんじられない。", english: "Even assuming that's true, I can't believe it." },
        { japanese: "彼が来たとしたら、どうする？", furigana: "かれがきたとしたら、どうする？", english: "What would you do if he came?" },
        { japanese: "たとえ許可を得たとしても、危険な作業には変わりない。", furigana: "たとえきょかをえたとしても、きけんなさぎょうにはかわりない。", english: "Even granting that permission was obtained, it's still a dangerous task." }
      ]}
    ]
  },
  {
    id: "n2-ni-watatte", level: "N2", pattern: "～にわたって / ～にわたる", title: "Throughout / extending over", short: "Spans across an entire timeframe, geographical area, or range.",
    explanation: "～にわたって follows a noun describing a span of time, distance, or number of instances, and means an event or state continues unbroken across that entire range — 'throughout X' or 'spanning X'. It emphasizes scale and continuity, and is common in news reports describing the extent of an event.",
    usages: [
      { title: "Broad span", examples: [
        { japanese: "会議は３時間にわたって行われた。", furigana: "かいぎはさんじかんにわたっておこなわれた。", english: "The meeting took place over a period of three hours." },
        { japanese: "この問題は長期にわたって研究されてきた。", furigana: "このもんだいはちょうきにわたってけんきゅうされてきた。", english: "This issue has been researched over a long period." },
        { japanese: "この工事は三年にわたって行われる予定だ。", furigana: "このこうじはさんねんにわたっておこなわれるよていだ。", english: "This construction is scheduled to take place over the span of three years." }
      ]}
    ]
  },
  {
    id: "n2-ni-tsurete", level: "N2", pattern: "～につれて / ～にしたがって", title: "As... then... / in step with", short: "A gradual change in one factor triggers a proportional change in another.",
    explanation: "～につれて and ～にしたがって both describe one change happening in step with another — as one thing progresses, so does the other. につれて leans toward describing gradual, natural changes (aging, seasons); にしたがって can also describe following a rule, instruction, or set of directions, a meaning につれて doesn't share.",
    usages: [
      { title: "Proportional change", examples: [
        { japanese: "標高が高くなるにつれて、気温が下がる。", furigana: "ひょうこうがたかくなるにつれて、きおんがさがる。", english: "As elevation increases, the temperature decreases." },
        { japanese: "年を取るにつれて、体が弱くなる。", furigana: "としをとるにつれて、からだがよわくなる。", english: "As I get older, my body gets weaker." },
        { japanese: "説明書にしたがって、組み立ててください。", furigana: "せつめいしょにしたがって、くみたててください。", english: "Please assemble it according to the instructions." }
      ]}
    ]
  },
  {
    id: "n2-ni-suginai", level: "N2", pattern: "～に過ぎない", title: "Nothing more than / merely", short: "Downplays the importance, scale, or status of something.",
    explanation: "～に過ぎない follows a noun and firmly downplays it as being nothing more than that one, often unimpressive, thing — 'is merely X' or 'is nothing but X'. It's frequently used to correct an overestimation others might have of something's importance or scale.",
    usages: [
      { title: "Minimizing status", examples: [
        { japanese: "それは単なる言い訳に過ぎない。", furigana: "それはたんなるいいわけにすぎない。", english: "That is nothing more than a simple excuse." },
        { japanese: "私の意見は一つの提案に過ぎない。", furigana: "わたしのいけんはひとつのていあんにすぎない。", english: "My opinion is merely one suggestion." },
        { japanese: "これはほんの一例に過ぎない。", furigana: "これはほんのいちれいにすぎない。", english: "This is merely one example, nothing more." }
      ]}
    ]
  },
  {
    id: "n2-ni-shite-wa", level: "N2", pattern: "～にしては", title: "For a / considering that it's", short: "The result is surprising given the specific identity or standard named.",
    explanation: "～にしては follows a noun and points out that something doesn't quite match the expectations that noun would normally set — 'for a X, this is surprisingly...'. It often carries a note of pleasant or unpleasant surprise, since the outcome deviates from the norm.",
    usages: [
      { title: "Surprising standard", examples: [
        { japanese: "彼は外国人にしては日本語がとても上手だ。", furigana: "かれはがいこくじんにしてはにほんごがとてもじょうずだ。", english: "For a foreigner, his Japanese is extremely good." },
        { japanese: "この料理は値段にしては美味しい。", furigana: "このりょうりはねだんにしてはおいしい。", english: "This dish is delicious for its price." },
        { japanese: "初めて作ったにしては、よくできている。", furigana: "はじめてつくったにしては、よくできている。", english: "For a first attempt, this turned out really well." }
      ]}
    ]
  },
  {
    id: "n2-wo-komete", level: "N2", pattern: "～を込めて", title: "Filled with / with all one's", short: "Pours a strong emotion or feeling into an action.",
    explanation: "～を込めて follows a noun describing an emotion or intention (感謝, 愛情, 心) and means putting that feeling fully into an action — 'with all one's X' or 'filled with X'. It's common in messages, gifts, and speeches expressing sincere feeling behind a gesture.",
    usages: [
      { title: "Emotional dedication", examples: [
        { japanese: "感謝の気持ちを込めて、手紙を書きました。", furigana: "かんしゃのきもちをこめて、てがみをかきました。", english: "I wrote a letter filled with feelings of gratitude." },
        { japanese: "心を込めて歌った。", furigana: "こころをこめてうたった。", english: "I sang with all my heart." },
        { japanese: "感謝を込めて、手紙を書いた。", furigana: "かんしゃをこめて、てがみをかいた。", english: "I wrote the letter filled with gratitude." }
      ]}
    ]
  },
  {
    id: "n2-wo-choushin", level: "N2", pattern: "～を中心に / ～を中心とする", title: "Centered around / focusing on", short: "Identifies the core element or hub around which actions revolve.",
    explanation: "～を中心に (or ～を中心として／とする) follows a noun and marks it as the main focus or hub that everything else revolves around — a person leading a project, a topic anchoring a discussion, or a location at the center of an area being described.",
    usages: [
      { title: "Core focus", examples: [
        { japanese: "若い世代を中心にそのアプリが流行している。", furigana: "わかいせだいをちゅうしんにそのアプリがりゅうこうしている。", english: "That app is popular, centered primarily around the younger generation." },
        { japanese: "駅を中心に、街が発展した。", furigana: "えきをちゅうしんに、まちがはってんした。", english: "The city developed centered around the station." },
        { japanese: "この地域は農業を中心に発展してきた。", furigana: "このちいきはのうぎょうをちゅうしんにはってんしてきた。", english: "This region has developed with agriculture at its center." }
      ]}
    ]
  },
  {
    id: "n2-wo-keiyu", level: "N2", pattern: "～を通じて / ～を通して", title: "Through / via / throughout", short: "Means or agent used to accomplish something, or spanning an entire period.",
    explanation: "～を通じて and ～を通して both mean 'through X' — via a means, a channel, or a person, or across an entire span of time. を通して leans slightly more toward describing something continuous across a whole duration (一年を通して, 'throughout the year'); を通じて works equally well for a means of communication or connection.",
    usages: [
      { title: "Via an intermediary", examples: [
        { japanese: "知人を通じてそのニュースを聞いた。", furigana: "ちじんをつうじてそのニュースをきいた。", english: "I heard that news through an acquaintance." },
        { japanese: "友人を通じて、その情報を知った。", furigana: "ゆうじんをつうじて、そのじょうほうをしった。", english: "I learned that information through a friend." }
      ]},
      { title: "Unbroken span", examples: [
        { japanese: "この地域は年間を通じて暖かい。", furigana: "このちいきはねんかんをつうじてあたたかい。", english: "This region is warm throughout the year." }
      ]}
    ]
  },
  {
    id: "n2-wo-taisho", level: "N2", pattern: "～を対象に / ～を対象とする", title: "Targeted at / aimed at", short: "Identifies the designated audience, subject pool, or group.",
    explanation: "～を対象に (or ～を対象として／とする) follows a noun describing a group and marks them as the intended audience, subject, or target of a survey, product, service, or policy.",
    usages: [
      { title: "Designated target", examples: [
        { japanese: "大学生を対象にしたアンケートを実施した。", furigana: "だいがくせいをたいしょうにしたアンケートをじっしした。", english: "We conducted a survey targeted at university students." },
        { japanese: "この商品は女性を対象にしている。", furigana: "このしょうひんはじょせいをたいしょうにしている。", english: "This product is targeted at women." },
        { japanese: "この講座は初心者を対象に開かれています。", furigana: "このこうざはしょしんしゃをたいしょうにひらかれています。", english: "This course is being held targeted at beginners." }
      ]}
    ]
  },
  {
    id: "n2-wo-keiki-ni", level: "N2", pattern: "～をきっかけに / ～を契機に", title: "As a result of / triggered by", short: "An event acts as the turning point or catalyst for a new development.",
    explanation: "～をきっかけに and ～を契機に both follow a noun describing an event and mean 'triggered by X' or 'as a result of X' — the named event was the spark that set a subsequent change into motion. を契機に is slightly more formal than をきっかけに, which is common in everyday speech as well as writing.",
    usages: [
      { title: "Catalyst for change", examples: [
        { japanese: "病気をきっかけに、酒をやめることにした。", furigana: "びょうきをきっかけに、さけをやめることにした。", english: "Triggered by my illness, I decided to quit alcohol." },
        { japanese: "この出会いをきっかけに、人生が変わった。", furigana: "このであいをきっかけに、じんせいがかわった。", english: "This encounter was the trigger that changed my life." },
        { japanese: "友人の紹介をきっかけに、この仕事を始めました。", furigana: "ゆうじんのしょうかいをきっかけに、このしごとをはじめました。", english: "I started this job as a result of a friend's introduction." }
      ]}
    ]
  },
  {
    id: "n2-wo-mottou", level: "N2", pattern: "～をはじめ（として）", title: "Starting with / including primarily", short: "Cites a primary example to represent a larger group.",
    explanation: "～をはじめ（として）follows a noun to give a prominent, representative example, implying that other similar things are also included but unstated — 'starting with X (and others)'. It's common when introducing the most notable member of a larger group.",
    usages: [
      { title: "Representative example", examples: [
        { japanese: "社長をはじめ、社員全員が参加した。", furigana: "しゃちょうをはじめ、しゃいいんぜんいんがさんかした。", english: "Starting with the president, all employees participated." },
        { japanese: "日本をはじめ、多くの国々が協力している。", furigana: "にほんをはじめ、おおくのくにぐにがきょうりょくしている。", english: "Starting with Japan, many countries are cooperating." },
        { japanese: "社長をはじめ、社員全員がその会議に出席した。", furigana: "しゃちょうをはじめ、しゃいんぜんいんがそのかいぎにしゅっせきした。", english: "Starting with the president, all the employees attended that meeting." }
      ]}
    ]
  },
  {
    id: "n2-wo-tozu", level: "N2", pattern: "～を問わず", title: "Regardless of / irrespective of", short: "States that a condition applies universally, regardless of distinctions.",
    explanation: "～を問わず follows a noun (often a pair of opposites like 年齢, 経験, 昼夜) and means the following statement applies regardless of that factor — 'regardless of X' or 'irrespective of X'.",
    usages: [
      { title: "No restrictions", examples: [
        { japanese: "経験の有無を問わず、やる気のある人を募集します。", furigana: "けいけんのうむをといわず、やるきのあるひとをぼしゅうします。", english: "We are recruiting motivated people, regardless of experience." },
        { japanese: "昼夜を問わず、働いている。", furigana: "ちゅうやをといわず、はたらいている。", english: "I work regardless of day or night." },
        { japanese: "経験の有無を問わず、応募できます。", furigana: "けいけんのうむをとわず、おうぼできます。", english: "You can apply regardless of whether you have experience or not." }
      ]}
    ]
  },
  {
    id: "n2-page-wakenai", level: "N2", pattern: "～わけだ", title: "That explains why / no wonder", short: "Reaches a logical conclusion or realizes why a state exists.",
    explanation: "～わけだ attaches to a plain-form phrase and states a conclusion that naturally follows from information already given — 'so that means X' or 'no wonder X'. It signals the speaker has just connected the dots, rather than introducing something new.",
    usages: [
      { title: "Logical realization", examples: [
        { japanese: "暑いわけだ。気温が35度もある。", furigana: "あついわけだ。きおんがさんじゅうごどもある。", english: "No wonder it's hot. The temperature is 35 degrees!" },
        { japanese: "彼は有名な学者だから、こんなに詳しいわけだ。", furigana: "かれはゆうめいながくしゃだから、こんなにくわしいわけだ。", english: "He's a famous scholar, so it makes sense that he's this knowledgeable." },
        { japanese: "彼は十年も日本に住んでいる。日本語が上手なわけだ。", furigana: "かれはじゅうねんもにほんにすんでいる。にほんごがじょうずなわけだ。", english: "He's lived in Japan for ten years. No wonder his Japanese is good." }
      ]}
    ]
  },
  {
    id: "n2-warii-niwa", level: "N2", pattern: "～わりに（は）", title: "Considering / given that", short: "An outcome is unexpected relative to the baseline standard.",
    explanation: "～わりに（は）connects a premise to a result that's unexpectedly disproportionate to it — either better or worse than the premise alone would predict. It's often used to gently praise or critique something by comparing it against a baseline expectation (price, effort, experience).",
    usages: [
      { title: "Disproportionate result", examples: [
        { japanese: "勉強したわりに、テストの点が良くなかった。", furigana: "べんきょうしたわりに、テストのてんがよくなかった。", english: "Considering how much I studied, my test score wasn't good." },
        { japanese: "この店は安いわりに、料理が美味しい。", furigana: "このみせはやすいわりに、りょうりがおいしい。", english: "This restaurant's food is tasty, considering how cheap it is." },
        { japanese: "十二月にしては、今日はわりに暖かい。", furigana: "じゅうにがつにしては、きょうはわりにあたたかい。", english: "For December, it's relatively warm today." }
      ]}
    ]
  },
  {
    id: "n2-wo-edemo", level: "N2", pattern: "～を得ない", title: "Cannot help but / unavoidable", short: "Formal phrasing indicating that an outcome is unavoidable.",
    explanation: "～を得ない appears almost exclusively in the fixed phrase やむを得ない ('unavoidable', literally 'cannot stop'), used when a situation leaves absolutely no acceptable alternative. It's common in formal explanations and apologies for decisions made under difficult circumstances.",
    usages: [
      { title: "Unavoidable situation", examples: [
        { japanese: "悪天候のため、中止もやむを得ない。", furigana: "あくてんこうのため、ちゅうしもやむをえない。", english: "Due to bad weather, cancellation is unavoidable." },
        { japanese: "経済的な理由から、値上げもやむを得ないだろう。", furigana: "けいざいてきなりゆうから、ねあげもやむをえないだろう。", english: "For economic reasons, a price increase is probably unavoidable." },
        { japanese: "彼が反対する以上、計画の中止もやむを得ない。", furigana: "かれがはんたいするいじょう、けいかくのちゅうしもやむをえない。", english: "Since he's opposed, cancelling the plan can't be helped." }
      ]}
    ]
  },
  {
    id: "n2-ni-shite-kara", level: "N2", pattern: "～にしろ / ～にせよ", title: "Even if / whether... or...", short: "States that a conclusion holds regardless of which condition applies.",
    explanation: "～にしろ and ～にせよ both attach to a plain-form phrase (or are paired, AにしろBにしろ) and mean 'whether it's A or B, the conclusion stays the same' — a formal concessive very close in meaning to としても, but with a stronger sense of listing out possibilities before dismissing their relevance.",
    usages: [
      { title: "Regardless of options", examples: [
        { japanese: "行くにせよ行かないにせよ、連絡してください。", furigana: "いくにせよいかないにせよ、れんらくしてください。", english: "Whether you go or not, please contact me." },
        { japanese: "冗談にしろ、言っていいことと悪いことがある。", furigana: "じょうだんにしろ、いっていいこととわるいことがある。", english: "Even if it's a joke, there are things you should and shouldn't say." },
        { japanese: "賛成にせよ反対にせよ、意見はきちんと述べるべきだ。", furigana: "さんせいにせよはんたいにせよ、いけんはきちんとのべるべきだ。", english: "Whether you're for it or against it, you should state your opinion clearly." }
      ]}
    ]
  },
  {
    id: "n2-mono-nara", level: "N2", pattern: "～ものなら", title: "If (you dare) / if it were possible", short: "Introduces a hypothetical, often a warning or a wish.",
    explanation: "～ものなら attaches to the potential form of a verb and sets up a challenging or wistful hypothetical — either daring someone to try something that's presented as unlikely to succeed, or wishing for something that feels just out of reach. The tone (challenge vs. wistfulness) depends entirely on context.",
    usages: [
      { title: "Dare / warning", examples: [
        { japanese: "その秘密を言うものなら、命はない。", furigana: "そのひみつをいうものなら、いのちはない。", english: "If you dare reveal that secret, you will lose your life." },
        { japanese: "できるものなら、もう一度あの日に戻りたい。", furigana: "できるものなら、もういちどあのひにもどりたい。", english: "If I could, I'd want to go back to that day one more time." }
      ]},
      { title: "Wishful hypothetical", examples: [
        { japanese: "できるものなら、一度でいいから会いたい。", furigana: "できるものなら、いちどでいいからあいたい。", english: "If it were at all possible, I would want to meet him just once." }
      ]}
    ]
  },
  {
    id: "n2-mono-no", level: "N2", pattern: "～ものの", title: "Although / but", short: "Concedes a fact, then notes that the expected result did not follow.",
    explanation: "～ものの attaches to the plain form of verbs and adjectives, or nouns + な, and means 'although' — it implies that the first fact should logically have led somewhere, but the expected result didn't follow. It reads as more detached and narrative than のに or けれども.",
    usages: [
      { title: "Unfulfilled expectation", examples: [
        { japanese: "計画は立てたものの、実行できない。", furigana: "けいかくはたてたものの、じっこうできない。", english: "I made a plan, but I can't put it into action." },
        { japanese: "薬を飲んだものの、熱はまだ下がらない。", furigana: "くすりをのんだものの、ねつはまださがらない。", english: "I took the medicine, but my fever still hasn't gone down." },
        { japanese: "留学を決意したものの、まだ両親には話していない。", furigana: "りゅうがくをけついしたものの、まだりょうしんにははなしていない。", english: "Although I've decided to study abroad, I haven't told my parents yet." }
      ]}
    ], notes: "Very close to のに and けれども, but with a more detached, narrative tone."
  },
  {
    id: "n2-mai", level: "N2", pattern: "～まい / ～んじゃないか", title: "Probably not / intend not to", short: "Negative volition or strong conjecture about the future.",
    explanation: "～まい is a classical negative-volitional ending attaching to the dictionary form of a verb, meaning 'I probably won't' or 'I'm determined not to' — a formal, literary way of stating a negative intention or strong guess, now mostly seen in writing and set expressions rather than everyday speech.",
    usages: [
      { title: "Negative intention", examples: [
        { japanese: "二度と行くまい。", furigana: "にどといくまい。", english: "I shall never go again." },
        { japanese: "二度とあの店には行くまいと決めた。", furigana: "にどとあのみせにはいくまいときめた。", english: "I decided I would never go to that shop again." }
      ]},
      { title: "Negative conjecture", examples: [
        { japanese: "彼は来るまい。", furigana: "かれはくるまい。", english: "He probably won't come." }
      ]}
    ], notes: "The modern spoken negative volition is usually ～ないつもりだ; ～まい sounds firmer and more literary."
  },
  {
    id: "n2-yo-ga-nai", level: "N2", pattern: "～ようがない / ～ようもない", title: "There is no way to", short: "An action is impossible because the means or possibility does not exist.",
    explanation: "～ようがない (or ～ようもない) attaches to the ます-stem of a verb and means there's literally no method or way to do something — not just difficulty, but a total absence of any viable means. It often implies the speaker has already thought it through and found no option at all.",
    usages: [
      { title: "No means possible", examples: [
        { japanese: "壊れてしまったら、直しようがない。", furigana: "こわれてしまったら、なおしようがない。", english: "Once it's broken, there's no way to fix it." },
        { japanese: "こんなに差がついては、勝ちようがない。", furigana: "こんなにさがついては、かちようがない。", english: "With this big a gap, there's no way to win." },
        { japanese: "連絡先を知らないので、彼には連絡のしようがない。", furigana: "れんらくさきをしらないので、かれにはれんらくのしようがない。", english: "I don't know his contact information, so there's no way for me to reach him." }
      ]}
    ], notes: "Do not confuse with ～ないわけではない (partial denial) — the meanings are unrelated."
  },
  {
    id: "n2-yue-ni", level: "N2", pattern: "～ゆえに / ～がゆえ（に）", title: "Therefore / because of (formal)", short: "A formal, literary reason or cause.",
    explanation: "～ゆえに attaches to a noun + の or the plain form of a verb/adjective and presents a cause in a formal, literary register — a heavier, more written alternative to から or ので. The related ～がゆえに (often ～であるがゆえに) emphasizes that a particular quality or state is precisely what leads to the consequence, frequently used for bittersweet or paradoxical outcomes.",
    usages: [
      { title: "Formal cause", examples: [
        { japanese: "努力したゆえに、成功した。", furigana: "どりょくしたゆえに、せいこうした。", english: "It was because I worked hard that I succeeded." },
        { japanese: "貧しさゆえに、学校をやめざるを得なかった。", furigana: "まずしさゆえに、がっこうをやめざるをえなかった。", english: "Because of poverty, he had no choice but to leave school." },
        { japanese: "経験不足ゆえに、判断を誤ってしまった。", furigana: "けいけんぶそくゆえに、はんだんをあやまってしまった。", english: "Because of a lack of experience, I made a wrong judgment." }
      ]}
    ]
  },
  {
    id: "n2-zu-ni-wa-irarenai", level: "N2", pattern: "～ずにはいられない", title: "Can't help doing", short: "An urge or emotion is impossible to resist.",
    explanation: "～ずにはいられない attaches to the negative stem of a verb (without い) and describes an emotional or physical urge so strong it's impossible to suppress — 'can't help but do X'. Compare with the related ～てはいられない ('can't afford to keep doing X'), which is about urgency overriding routine rather than an urge overriding self-control.",
    usages: [
      { title: "Irresistible urge", examples: [
        { japanese: "面白くて笑わずにはいられなかった。", furigana: "おもしろくてわらわずにはいられなかった。", english: "It was so funny I couldn't help laughing." },
        { japanese: "その映画を見ると、いつも泣かずにはいられない。", furigana: "そのえいがをみると、いつもなかずにはいられない。", english: "Whenever I watch that movie, I can't help but cry." },
        { japanese: "彼のユーモアには、笑わずにはいられない。", furigana: "かれのユーモアには、わらわずにはいられない。", english: "I can't help but laugh at his sense of humor." }
      ]}
    ], notes: "～してはいられない ('cannot afford to keep doing') is related but distinct."
  },
  {
    id: "n2-nara-de-wa", level: "N2", pattern: "～ならでは", title: "Unique to / only possible with", short: "A quality or thing that exists only because of its source.",
    explanation: "～ならでは follows a noun and praises something as uniquely possible only because of that specific person, place, or thing — 'only X could achieve/produce this'. It's a complimentary expression, often seen in tourism and marketing praising a regional specialty or an expert's distinctive skill.",
    usages: [
      { title: "Unique quality", examples: [
        { japanese: "京都ならではの景色を楽しみました。", furigana: "きょうとならではのけしきをたのしみました。", english: "I enjoyed scenery you can only find in Kyoto." },
        { japanese: "彼女ならではのセンスがある。", furigana: "かのじょならではのセンスがある。", english: "She has a sense of style that is uniquely hers." },
        { japanese: "この味は、この店ならではだ。", furigana: "このあじは、このみせならではだ。", english: "This flavor is something only this shop can offer." }
      ]}
    ]
  },
  {
    id: "n2-nari-ni", level: "N2", pattern: "～なりに", title: "In one's own way", short: "Doing something according to one's own ability, style, or position.",
    explanation: "～なりに follows a noun (often 自分, 私, or a description of someone's ability or position) and means doing something to the best of one's own particular capacity — not as well as someone else might, but genuinely and sincerely within one's own limits.",
    usages: [
      { title: "One's own way", examples: [
        { japanese: "私なりに一生懸命やっています。", furigana: "わたしなりにいっしょうけんめいやっています。", english: "I'm doing my best in my own way." },
        { japanese: "子供なりに考えているんだろう。", furigana: "こどもなりにかんがえているんだろう。", english: "He's probably thinking about it in his own way as a child." },
        { japanese: "初心者なりに、精一杯頑張りました。", furigana: "しょしんしゃなりに、せいいっぱいがんばりました。", english: "In my own way as a beginner, I did my very best." }
      ]}
    ]
  },
  {
    id: "n2-kagiri-da", level: "N2", pattern: "～限りだ", title: "Feels extremely / nothing could be more", short: "Expresses a strong, often positive, emotion.",
    explanation: "～限りだ attaches to an emotional な-adjective or い-adjective stem and intensifies a personal feeling to its extreme — 'I couldn't be more X' or 'nothing could be more X'. Unlike ものだ, this is always about the speaker's own immediate emotional reaction, not a general truth.",
    usages: [
      { title: "Peak emotion", examples: [
        { japanese: "合格できて、うれしい限りです。", furigana: "ごうかくできて、うれしいかぎりです。", english: "I'm delighted beyond words to have passed." },
        { japanese: "残念な限りだ。", furigana: "ざんねんなかぎりだ。", english: "I'm extremely disappointed." },
        { japanese: "こんな結果になって、残念な限りです。", furigana: "こんなけっかになって、ざんねんなかぎりです。", english: "Ending up with a result like this, I couldn't be more disappointed." }
      ]}
    ]
  },
  {
    id: "n2-kagiri-de", level: "N2", pattern: "～限りでは / ～ない限り", title: "As far as / unless", short: "States the scope of knowledge, or a minimum condition.",
    explanation: "～限りでは attaches to a verb of perception (見る, 聞く, 知る) and limits a claim to what the speaker has personally observed — 'as far as I can tell from X'. ～ない限り is a separate, unrelated use meaning 'unless' — 'as long as X doesn't happen, Y won't either'.",
    usages: [
      { title: "Scope of knowledge", examples: [
        { japanese: "私の知っている限りでは、彼は来ません。", furigana: "わたしのしっているかぎりでは、かれはきません。", english: "As far as I know, he is not coming." },
        { japanese: "謝らない限り、彼女は許してくれないだろう。", furigana: "あやまらないかぎり、かのじょはゆるしてくれないだろう。", english: "Unless you apologize, she probably won't forgive you." }
      ]},
      { title: "Minimum condition", examples: [
        { japanese: "努力しない限り、成功はない。", furigana: "どりょくしないかぎり、せいこうはない。", english: "Unless you make an effort, there is no success." }
      ]}
    ]
  },
  {
    id: "n2-tote", level: "N2", pattern: "～とて", title: "Even if (literary)", short: "Concedes an extreme case while firmly rejecting the conclusion.",
    explanation: "～とて is a formal, literary concessive attaching to plain forms, meaning 'even if' or 'even though' — it firmly rejects the idea that the stated condition would change anything about the conclusion. It's closer in feel to classical Japanese than to everyday speech.",
    usages: [
      { title: "Firm concession", examples: [
        { japanese: "どんなに相手が強いとて、諦めるものか。", furigana: "どんなにあいてがつよいとて、あきらめるものか。", english: "No matter how strong the opponent, I will never give up." },
        { japanese: "子供とて、嘘をつけば叱られる。", furigana: "こどもとて、うそをつけばしかられる。", english: "Even being a child, if you lie you'll be scolded." },
        { japanese: "後悔したとて、もう取り返しはつかない。", furigana: "こうかいしたとて、もうとりかえしはつかない。", english: "Even if you regret it, there's no undoing it now." }
      ]}
    ]
  },
  {
    id: "n2-to-bakari-ni", level: "N2", pattern: "～とばかりに", title: "As if to say", short: "An action or expression that strongly implies unspoken words.",
    explanation: "～とばかりに attaches to a quoted phrase or a plain-form sentence and describes someone's clear body language or actions conveying an unspoken message just as strongly as words would — 'as if to say X' — usually a message the person didn't actually voice aloud.",
    usages: [
      { title: "Implied words in action", examples: [
        { japanese: "彼は「勝った」とばかりに、両手を上げた。", furigana: "かれは「かった」とばかりに、りょうてをあげた。", english: "He raised both hands as if to say 'I won'." },
        { japanese: "早く行けとばかりに、彼はドアを指さした。", furigana: "はやくいけとばかりに、かれはドアをゆびさした。", english: "He pointed at the door as if to say 'Go now!'." },
        { japanese: "もう帰れとばかりに、店員が時計を見た。", furigana: "もうかえれとばかりに、てんいんがとけいをみた。", english: "The clerk looked at the clock as if to say 'time to go home already'." }
      ]}
    ]
  },
  {
    id: "n2-tomonareba", level: "N2", pattern: "～ともなると / ～ともなれば", title: "When it comes to / once it becomes", short: "A change in status or time brings different conditions or behavior.",
    explanation: "～ともなると (or ～ともなれば) follows a noun describing a significant stage, role, or level, and means 'once it reaches the point of being X, naturally...' — the situation described justifies a corresponding, often greater, level of expectation or change.",
    usages: [
      { title: "New circumstances", examples: [
        { japanese: "春ともなると、観光客で賑わう。", furigana: "はるともなると、かんこうきゃくでにぎわう。", english: "Once spring arrives, the place bustles with tourists." },
        { japanese: "管理職ともなると、責任も重い。", furigana: "かんりしょくともなると、せきにんもおもい。", english: "Once you become a manager, the responsibility is heavy." },
        { japanese: "全国大会ともなると、緊張感が違う。", furigana: "ぜんこくたいかいともなると、きんちょうかんがちがう。", english: "Once it's a national tournament, the tension is on a different level." }
      ]}
    ]
  },
  {
    id: "n2-mono-ka", level: "N2", pattern: "～ものか / ～もんか", title: "Absolutely not / no way", short: "A firm, emotional rejection of doing something.",
    explanation: "～ものか (casual ～もんか) attaches to a plain-form phrase and turns it into a forceful rhetorical denial — 'as if I would!' or 'no way would that happen!'. The literal question form masks what is really an emphatic 'absolutely not'.",
    usages: [
      { title: "Defiant refusal", examples: [
        { japanese: "こんな所、もう二度と来るものか。", furigana: "こんなところ、もうにどとくるものか。", english: "There's no way I'm ever coming to a place like this again." },
        { japanese: "そんなこと、知るもんか！", furigana: "そんなこと、しるもんか！", english: "Like I would know that!" },
        { japanese: "こんなことで負けるものか。", furigana: "こんなことでまけるものか。", english: "There's no way I'll lose over something like this." }
      ]}
    ]
  },
  {
    id: "n2-mono-wo", level: "N2", pattern: "～ものを", title: "Although... (regret / criticism)", short: "Expresses regret or mild criticism that something did not happen.",
    explanation: "～ものを attaches to a plain-form phrase, usually at the end of a sentence, and expresses regret or mild reproach that things could have gone better if only something had been done differently — 'if only X, but...'. It often trails off, leaving the criticism implied rather than fully spelled out.",
    usages: [
      { title: "Regret about the past", examples: [
        { japanese: "さっき言ってくれれば、助けたものを。", furigana: "さっきいってくれれば、たすけたものを。", english: "If you had told me earlier, I would have helped you." },
        { japanese: "ちゃんと勉強していれば、合格したものを。", furigana: "ちゃんとべんきょうしていれば、ごうかくしたものを。", english: "If you had studied properly, you would have passed." },
        { japanese: "早く言ってくれれば手伝えたものを。", furigana: "はやくいってくれればてつだえたものを。", english: "If only you'd told me sooner, I could have helped." }
      ]}
    ]
  },
  {
    id: "n2-nagara-mo", level: "N2", pattern: "～ながら（も）", title: "Although / despite", short: "A formal concessive: two contradictory facts coexist.",
    explanation: "～ながら（も）attaches to the ます-stem of a verb or an adjective and means 'although' — a more formal register than the plain concessive ながら used alone, often appearing in set phrases like 残念ながら ('regrettably') and 若いながらも ('despite being young').",
    usages: [
      { title: "Formal concession", examples: [
        { japanese: "残念ながら、今回は見送ります。", furigana: "ざんねんながら、こんかいはみおくります。", english: "Regrettably, we will pass this time." },
        { japanese: "若いながらも、彼はとても落ち着いている。", furigana: "わかいながらも、かれはとてもおちついている。", english: "Despite being young, he is very composed." },
        { japanese: "狭いながらも、居心地のいい部屋だ。", furigana: "せまいながらも、いごこちのいいへやだ。", english: "It's a comfortable room, despite being small." }
      ]}
    ], notes: "残念ながら and 幸いながら are set phrases where ながら clearly means 'although'."
  },
  {
    id: "n2-tada-nomi", level: "N2", pattern: "～ただ～のみだ / ～のみ", title: "Only / nothing but (formal)", short: "A formal, literary restriction meaning 'nothing more than'.",
    explanation: "～ただ～のみだ is a formal, emphatic way to say 'the only thing left is X' or 'all that remains is X' — ただ and のみ both mean 'only', used together for extra emphasis in formal speech and writing, often at a decisive or resolute moment.",
    usages: [
      { title: "Sole option", examples: [
        { japanese: "今は祈るのみだ。", furigana: "いまはいのるのみだ。", english: "All we can do now is pray." },
        { japanese: "ただ信じるのみだ。", furigana: "ただしんじるのみだ。", english: "All we can do is believe." },
        { japanese: "準備は整った。あとはただ本番を待つのみだ。", furigana: "じゅんびはととのった。あとはただほんばんをまつのみだ。", english: "Preparations are complete. All that's left now is to wait for the real thing." }
      ]}
    ]
  },
  {
    id: "n2-wa-moto-yori", level: "N2", pattern: "～はもとより", title: "Not to mention / of course", short: "X is obvious; Y goes without saying too.",
    explanation: "～はもとより follows a noun and means 'not to mention X' or 'needless to say, X' — it introduces an obvious baseline case before going on to mention something even more noteworthy, similar in structure to はおろか but usually used for positive or neutral extensions rather than denials.",
    usages: [
      { title: "A fortiori statement", examples: [
        { japanese: "子供はもとより、大人も楽しめます。", furigana: "こどもはもとより、おとなもたのしめます。", english: "Children of course, but adults can enjoy it too." },
        { japanese: "彼は学生時代はもとより、今でも忙しい。", furigana: "かれはがくせいじだいはもとより、いまでもいそがしい。", english: "He was busy as a student, and he's still busy now." },
        { japanese: "彼は英語はもとより、フランス語やドイツ語も話せる。", furigana: "かれはえいごはもとより、フランスごやドイツごもはなせる。", english: "Not to mention English, he can also speak French and German." }
      ]}
    ]
  },
  {
    id: "n2-wo-megutte", level: "N2", pattern: "～をめぐって / ～をめぐる", title: "Concerning / over / around", short: "Centers on a point of dispute, discussion, or interest.",
    explanation: "～をめぐって（or ～をめぐる）follows a noun naming a contested topic or issue, and describes discussion, conflict, or debate happening around it — 'concerning X' or 'over the issue of X'. It's common in news reporting on disputes, negotiations, and controversies.",
    usages: [
      { title: "Center of dispute", examples: [
        { japanese: "領土をめぐって争いが続いている。", furigana: "りょうどをめぐってあらそいがつづいている。", english: "Conflict continues over the territory." },
        { japanese: "この問題をめぐって議論が行われた。", furigana: "このもんだいをめぐってぎろんがおこなわれた。", english: "Discussion was held concerning this issue." },
        { japanese: "この土地をめぐって、長年争いが続いている。", furigana: "このとちをめぐって、ながねんあらそいがつづいている。", english: "There has been a long-running dispute over this land." }
      ]}
    ]
  },
  {
    id: "n2-wo-moto-ni", level: "N2", pattern: "～をもとに（して）", title: "Based on / modeled on", short: "Using something as the raw material, model, or source.",
    explanation: "～をもとに（して）follows a noun describing a foundation (data, an idea, a real event) and means something new was created or modeled using it as the basis — similar to を踏まえて, but もとに leans slightly more toward creative or constructive processes (writing a novel, designing something) rather than analytical decision-making.",
    usages: [
      { title: "Source material", examples: [
        { japanese: "実話をもとにした小説です。", furigana: "じつわをもとにしたしょうせつです。", english: "It is a novel based on a true story." },
        { japanese: "データをもとに分析した。", furigana: "データをもとにぶんせきした。", english: "I analyzed based on the data." },
        { japanese: "この小説は作者の実体験をもとに書かれた。", furigana: "このしょうせつはさくしゃのじったいけんをもとにかかれた。", english: "This novel was written based on the author's real experiences." }
      ]}
    ]
  },
  {
    id: "n2-goto-ni", level: "N2", pattern: "～ごとに", title: "Each / every", short: "Something happens repeatedly at every instance of an event.",
    explanation: "～ごとに follows a noun or the dictionary form of a verb and means 'every X' or 'at each X', emphasizing regular, repeated intervals. With verbs, ～たびに is the more common everyday choice; ごとに leans slightly more formal and is especially natural with numbers and counters (十分ごとに, 'every ten minutes').",
    usages: [
      { title: "Regular repetition", examples: [
        { japanese: "季節ごとに景色が変わる。", furigana: "きせつごとにけしきがかわる。", english: "The scenery changes with every season." },
        { japanese: "この薬は八時間ごとに飲んでください。", furigana: "このくすりははちじかんごとにのんでください。", english: "Please take this medicine every eight hours." },
        { japanese: "この電車は各駅ごとに停車する。", furigana: "このでんしゃはかくえきごとにていしゃする。", english: "This train stops at every single station." }
      ]}
    ], notes: "With verbs, ～たびに is more common; ごとに leans slightly more formal."
  },
  {
    id: "n2-goto-ku", level: "N2", pattern: "～ごとく / ～ごとし", title: "Like / as if (formal)", short: "A literary simile meaning 'as if' or 'just like'.",
    explanation: "～ごとく (adverbial) and ～ごとし (predicate form, functioning like な before a noun) create formal, literary similes meaning 'like' or 'as if' — the written-style equivalent of のように, common in proverbs, classical-flavored writing, and formal speeches.",
    usages: [
      { title: "Literary simile", examples: [
        { japanese: "彼は鬼のごとく働く。", furigana: "かれはおにのごとくはたらく。", english: "He works like a demon." },
        { japanese: "時は矢のごとし。", furigana: "ときはやのごとし。", english: "Time flies like an arrow." },
        { japanese: "彼女は何事もなかったごとく、平然としていた。", furigana: "かのじょはなにごともなかったごとく、へいぜんとしていた。", english: "She remained calm, as if nothing had happened." }
      ]}
    ], notes: "ごとし conjugates like an adjective: ごとき (attributive), ごとく (adverbial), ごとし (predicative)."
  },
  {
    id: "n2-yori-hoka-nai", level: "N2", pattern: "～よりほかない / ～よりほかならない", title: "Nothing to do but / no one but", short: "The only remaining action or person.",
    explanation: "～よりほかない attaches to the dictionary form of a verb (or a noun + に) and means there's no alternative but to do that one thing — a slightly more formal cousin of ほかない. ～よりほかならない, following a noun, instead means 'is none other than X' — a different construction sharing the same ほか root but a distinct meaning.",
    usages: [
      { title: "Only action left", examples: [
        { japanese: "ここは謝るよりほかない。", furigana: "ここはあやまるよりほかない。", english: "At this point there's nothing to do but apologize." },
        { japanese: "彼にこの仕事を任せるよりほかならない。", furigana: "かれにこのしごとをまかせるよりほかならない。", english: "There's no one but him to entrust this work to." },
        { japanese: "この状況では、待つよりほかない。", furigana: "このじょうきょうでは、まつよりほかない。", english: "In this situation, there's nothing to do but wait." }
      ]}
    ], notes: "Slightly more formal than ～ほかない (N3); meaning is essentially the same."
  },
  {
    id: "n2-kara-shite", level: "N2", pattern: "～からして", title: "From the very / even by", short: "Judging from one representative aspect, everything else follows.",
    explanation: "～からして follows a noun and offers it as the most immediately obvious piece of evidence for a broader judgment — 'just going by X alone, you can already tell...'. It often points to something superficial (appearance, name, attitude) as proof of a larger conclusion.",
    usages: [
      { title: "Representative aspect", examples: [
        { japanese: "この店は接客からして違う。", furigana: "このみせはせっきゃくからしてちがう。", english: "This shop is different right from its customer service." },
        { japanese: "彼の服装からして、おしゃれな人だと分かる。", furigana: "かれのふくそうからして、おしゃれなひとだとわかる。", english: "From his clothes alone, you can tell he's fashionable." },
        { japanese: "彼の話し方からして、育ちの良さが感じられる。", furigana: "かれのはなしかたからして、そだちのよさがかんじられる。", english: "Just from the way he talks, you can sense he was raised well." }
      ]}
    ]
  },
  {
    id: "n2-nnto-suru", level: "N2", pattern: "～んとする / ～ようとする", title: "About to / on the verge of / try to", short: "An action is just starting, or a strong attempt is being made.",
    explanation: "～んとする is the literary negative-adverbial form (as in 言わんとする) or used in ～とする after a volitional form. It means 'to be about to' or 'to make an effort to' do something, and reads as noticeably more formal and written than plain ～ようとする.",
    usages: [
      { title: "On the verge", examples: [
        { japanese: "出ようとした時、電話が鳴った。", furigana: "でようとしたとき、でんわがなった。", english: "Just as I was about to leave, the phone rang." },
        { japanese: "彼はその問題を解こうとしている。", furigana: "かれはそのもんだいをとこうとしている。", english: "He's trying to solve that problem." },
        { japanese: "太陽が今にも沈まんとしている。", furigana: "たいようがいまにもしずまんとしている。", english: "The sun is just about to set." }
      ]}
    ]
  },
  {
    id: "n2-nai-koto-niwa", level: "N2", pattern: "～ないことには", title: "Unless / without doing", short: "Says that nothing can proceed until a first condition is met.",
    explanation: "～ないことには attaches to the negative stem of a verb or adjective and states that, unless the named condition is met first, a following negative outcome is unavoidable — 'unless X, Y won't happen'. It's almost always paired with a negative main clause, since the whole point is stressing that nothing can proceed without the condition.",
    usages: [
      { title: "Necessary first step", examples: [
        { japanese: "実際に食べてみないことには、味は分かりません。", furigana: "じっさいにたべてみないことには、あじはわかりません。", english: "Unless you actually try eating it, you won't know the taste." },
        { japanese: "お金がないことには、旅行にも行けない。", furigana: "おかねがないことには、りょこうにもいけない。", english: "Without money, I can't even go on a trip." },
        { japanese: "本人に確認しないことには、何とも言えません。", furigana: "ほんにんにかくにんしないことには、なんともいえません。", english: "Unless I check with the person themselves, I can't say anything either way." }
      ]}
    ], notes: "Almost always paired with a negative main clause (～ない, ～わけにはいかない), since it stresses that nothing can happen without the condition."
  },
  {
    id: "n2-ijou", level: "N2", pattern: "～以上（は）", title: "Now that / Since", short: "Given that a situation is true, a natural obligation or conclusion follows.",
    explanation: "～以上（は） attaches to a plain-form verb and means 'given that X is the case' — since the premise is true, the speaker draws a firm conclusion or states a resulting obligation. It has a resolved, no-turning-back tone, similar in spirit to からには but slightly more formal and often used to state a rule or principle rather than personal resolve.",
    usages: [
      { title: "Resulting obligation", examples: [
        { japanese: "約束した以上、必ず守ります。", furigana: "やくそくしたいじょう、かならずまもります。", english: "Now that I've promised, I will definitely keep it." },
        { japanese: "学生である以上、勉強するのは当然だ。", furigana: "がくせいであるいじょう、べんきょうするのはとうぜんだ。", english: "Since you're a student, it's only natural that you study." },
        { japanese: "引き受けた以上、最後までやり遂げます。", furigana: "ひきうけたいじょう、さいごまでやりとげます。", english: "Now that I've taken this on, I'll see it through to the end." }
      ]}
    ]
  },
  {
    id: "n2-ue-de", level: "N2", pattern: "～上で", title: "After doing / Having done", short: "One step is completed before the next, more important, action takes place.",
    explanation: "～上で attaches to a た-form verb or noun + の and means 'after doing X (and based on it), Y happens'. It emphasizes that X is a deliberate, necessary foundation for the decision or action that follows — not just a chronological sequence, but a logical one.",
    usages: [
      { title: "Necessary foundation", examples: [
        { japanese: "よく考えた上で、返事をします。", furigana: "よくかんがえたうえで、へんじをします。", english: "I will reply after thinking it over carefully." },
        { japanese: "契約書にサインした上で、鍵をお渡しします。", furigana: "けいやくしょにサインしたうえで、かぎをおわたしします。", english: "We will hand over the key after you sign the contract." },
        { japanese: "資料を確認した上で、改めてご連絡いたします。", furigana: "しりょうをかくにんしたうえで、あらためてごれんらくいたします。", english: "I will contact you again after confirming the materials." }
      ]}
    ]
  },
  {
    id: "n2-ue-ni", level: "N2", pattern: "～上に", title: "In addition to / On top of", short: "Adds a second fact that stacks on top of the first, usually intensifying it.",
    explanation: "～上に attaches to a plain-form phrase and adds an extra fact on top of the first, often making a good situation even better or a bad one even worse. Unlike 上で (which describes a deliberate sequence of actions), 上に is purely about stacking facts, with no implied order or intention.",
    usages: [
      { title: "Stacking facts", examples: [
        { japanese: "このアパートは駅から近い上に、家賃も安い。", furigana: "このアパートはえきからちかいうえに、やちんもやすい。", english: "This apartment is close to the station, and on top of that, the rent is cheap." },
        { japanese: "道に迷った上に、雨まで降ってきた。", furigana: "みちにまよったうえに、あめまでふってきた。", english: "Not only did I get lost, but it started raining on top of it." },
        { japanese: "彼は頭がいい上に、努力家でもある。", furigana: "かれはあたまがいいうえに、どりょくかでもある。", english: "He's smart, and on top of that, he's also a hard worker." }
      ]}
    ]
  },
  {
    id: "n2-eru-uru", level: "N2", pattern: "～得る / ～得ない", title: "Can happen / Cannot happen (formal)", short: "A formal way to say whether something is possible in principle.",
    explanation: "～得る (read える or うる) attaches to a verb stem to state that something is possible in principle — more formal and abstract than the ordinary potential form, often used to discuss theoretical possibilities rather than someone's personal ability. Its negative, ～得ない (えない), states that something is impossible or unthinkable, and is always read えない, never うない.",
    usages: [
      { title: "Possible in principle", examples: [
        { japanese: "そのミスは誰にでも起こり得る。", furigana: "そのミスはだれにでもおこりうる。", english: "That mistake could happen to anyone." },
        { japanese: "理論上は、この現象も起こり得る。", furigana: "りろんじょうは、このげんしょうもおこりうる。", english: "In theory, this phenomenon could happen too." }
      ]},
      { title: "Impossible / unthinkable", examples: [
        { japanese: "彼が裏切るなんて、あり得ない。", furigana: "かれがうらぎるなんて、ありえない。", english: "It's unthinkable that he would betray us." }
      ]}
    ], notes: "得る is read うる in its plain dictionary form but える when conjugated (見えます is unrelated; 起こり得ます uses えます). ～得ない is always read えない."
  },
  {
    id: "n2-omakeni", level: "N2", pattern: "おまけに", title: "On top of that / Besides", short: "Adds one more fact, usually piling onto an already extreme situation.",
    explanation: "おまけに begins a new clause or sentence to add an extra fact on top of what was just said, often making an already bad situation worse (though it can add good things too, if used ironically or in a lighter context).",
    usages: [
      { title: "Piling on", examples: [
        { japanese: "財布を無くした。おまけに、携帯電話も壊れてしまった。", furigana: "さいふをなくした。おまけに、けいたいでんわもこわれてしまった。", english: "I lost my wallet. On top of that, my phone broke too." },
        { japanese: "道に迷い、おまけに雨まで降ってきた。", furigana: "みちにまよい、おまけにあめまでふってきた。", english: "I got lost, and on top of that, it even started raining." },
        { japanese: "テストの点も悪かった。おまけに、財布まで落としてしまった。", furigana: "テストのてんもわるかった。おまけに、さいふまでおとしてしまった。", english: "My test score was also bad. On top of that, I even lost my wallet." }
      ]}
    ]
  },
  {
    id: "n2-ka-naika-no-uchini", level: "N2", pattern: "～か～ないかのうちに", title: "No sooner had ... than", short: "The second event happens almost the instant the first one starts.",
    explanation: "～か～ないかのうちに repeats a verb in affirmative and negative form to say that a second event happened at the very instant the first was starting, with almost no gap between them — a formal, slightly literary equivalent of とたんに, often used in narrative writing.",
    usages: [
      { title: "Near-instant succession", examples: [
        { japanese: "ベルが鳴るか鳴らないかのうちに、子供たちは教室を飛び出した。", furigana: "ベルがなるかならないかのうちに、こどもたちはきょうしつをとびだした。", english: "The children dashed out of the classroom almost before the bell had finished ringing." },
        { japanese: "「いただきます」と言うかいわないかのうちに、彼は食べ始めた。", furigana: "「いただきます」というかいわないかのうちに、かれはたべはじめた。", english: "He started eating almost before he'd finished saying \"itadakimasu.\"" },
        { japanese: "電車のドアが閉まるか閉まらないかのうちに、彼は飛び乗った。", furigana: "でんしゃのドアがしまるかしまらないかのうちに、かれはとびのった。", english: "He jumped on almost before the train doors had finished closing." }
      ]}
    ]
  },
  {
    id: "n2-kaigaaru", level: "N2", pattern: "～かいがある / ～がい", title: "Worth it / Rewarding to", short: "Effort put into something paid off, or a thing is rewarding to do.",
    explanation: "～かいがある follows a verb (usually past tense) to say the effort put in was worthwhile, given the result. The related suffix ～がい attaches directly to a verb stem to form a noun meaning 'worth doing' (やりがい, 'a sense of purpose in doing something'; 生きがい, 'a reason for living').",
    usages: [
      { title: "Effort paid off", examples: [
        { japanese: "毎日練習したかいがあって、大会で優勝できた。", furigana: "まいにちれんしゅうしたかいがあって、たいかいでゆうしょうできた。", english: "The daily practice paid off, and I was able to win the tournament." },
        { japanese: "留学したかいがあって、英語がかなり上達した。", furigana: "りゅうがくしたかいがあって、えいごがかなりじょうたつした。", english: "Studying abroad paid off, and my English improved quite a bit." }
      ]},
      { title: "\"Worth doing\" noun (～がい)", examples: [
        { japanese: "この仕事はやりがいがあります。", furigana: "このしごとはやりがいがあります。", english: "This job is rewarding to do." }
      ]}
    ]
  },
  {
    id: "n2-kaette", level: "N2", pattern: "かえって", title: "On the contrary / If anything", short: "An action produces the opposite of its intended effect.",
    explanation: "かえって describes a result that is the reverse of what was expected or intended — help that makes things worse, medicine that makes someone feel worse, effort that backfires. It signals a genuine reversal, not just a minor deviation from expectations.",
    usages: [
      { title: "Reverse of intended effect", examples: [
        { japanese: "薬を飲んだら、かえって具合が悪くなった。", furigana: "くすりをのんだら、かえってぐあいがわるくなった。", english: "After taking the medicine, I actually felt worse, if anything." },
        { japanese: "手伝おうとしたら、かえって邪魔になってしまった。", furigana: "てつだおうとしたら、かえってじゃまになってしまった。", english: "I tried to help, but I only ended up getting in the way instead." },
        { japanese: "早く終わらせようと急いだら、かえって時間がかかってしまった。", furigana: "はやくおわらせようといそいだら、かえってじかんがかかってしまった。", english: "I rushed to finish quickly, but it ended up taking even longer instead." }
      ]}
    ]
  },
  {
    id: "n2-kato-omottara", level: "N2", pattern: "～かと思ったら / ～かと思うと", title: "Just when ... / No sooner had", short: "Something unexpected happens right after, or instead of, what seemed about to happen.",
    explanation: "～かと思ったら (or ～かと思うと) attaches to a plain-form verb and describes a surprising event happening right after, or instead of, what the speaker expected — often with a sense of abruptness or whiplash. It's commonly used in narrating a quick, unexpected turn of events.",
    usages: [
      { title: "Surprising immediate follow-up", examples: [
        { japanese: "泣いていたかと思ったら、もう笑っている。", furigana: "ないていたかとおもったら、もうわらっている。", english: "Just when I thought she was crying, she's already laughing." },
        { japanese: "空が急に暗くなったかと思うと、大雨が降り出した。", furigana: "そらがきゅうにくらくなったかとおもうと、おおあめがふりだした。", english: "No sooner had the sky suddenly darkened than it started pouring rain." },
        { japanese: "静かになったかと思ったら、また騒ぎ出した。", furigana: "しずかになったかとおもったら、またさわぎだした。", english: "Just when it seemed to have quieted down, it got noisy again." }
      ]}
    ]
  },
  {
    id: "n2-karakoso", level: "N2", pattern: "～からこそ", title: "Precisely because", short: "Strongly emphasizes that this specific reason, and no other, is the true cause.",
    explanation: "～からこそ attaches to a plain-form phrase and strongly emphasizes the reason, meaning 'it's precisely because of X (and nothing else)'. It's stronger and more pointed than plain から, which just states a reason neutrally.",
    usages: [
      { title: "Emphatic reason", examples: [
        { japanese: "あなたのことが大切だからこそ、注意しているんです。", furigana: "あなたのことがたいせつだからこそ、ちゅういしているんです。", english: "It's precisely because I care about you that I'm warning you." },
        { japanese: "厳しい練習があったからこそ、この結果が出せた。", furigana: "きびしいれんしゅうがあったからこそ、このけっかがだせた。", english: "It's precisely because of the tough practice that we achieved this result." },
        { japanese: "失敗したからこそ、学べることもある。", furigana: "しっぱいしたからこそ、まなべることもある。", english: "It's precisely because you failed that there are things you can learn." }
      ]}
    ]
  },
  {
    id: "n2-karasuruto", level: "N2", pattern: "～からすると / ～からすれば", title: "Judging from / From the standpoint of", short: "Reaches a conclusion or offers a perspective based on some piece of evidence.",
    explanation: "～からすると (or ～からすれば) follows a noun and means 'judging from X' or 'from X's standpoint', introducing an inference or a particular point of view. からすれば leans slightly more toward emphasizing a personal perspective; からすると is a bit more neutral, often used for inferences based on evidence.",
    usages: [
      { title: "Judging from evidence", examples: [
        { japanese: "この雲の様子からすると、もうすぐ雨が降りそうだ。", furigana: "このくものようすからすると、もうすぐあめがふりそうだ。", english: "Judging from the look of these clouds, it seems like it will rain soon." },
        { japanese: "彼の態度からすると、うまくいかなかったようだ。", furigana: "かれのたいどからすると、うまくいかなかったようだ。", english: "Judging from his attitude, it seems like things didn't go well." }
      ]},
      { title: "From someone's perspective", examples: [
        { japanese: "初心者からすれば、この説明は難しすぎる。", furigana: "しょしんしゃからすれば、このせつめいはむずかしすぎる。", english: "From a beginner's point of view, this explanation is too difficult." }
      ]}
    ]
  },
  {
    id: "n2-karatoitte", level: "N2", pattern: "～からといって", title: "Just because ... (doesn't mean)", short: "Rejects a conclusion that people might wrongly draw from a given reason.",
    explanation: "～からといって attaches to a plain-form phrase and is almost always followed by a negative statement, meaning 'just because X, that doesn't necessarily mean Y'. It's used to push back against a hasty generalization someone might be tempted to make.",
    usages: [
      { title: "Rejecting a false conclusion", examples: [
        { japanese: "日本人だからといって、みんな漢字が得意だとは限らない。", furigana: "にほんじんだからといって、みんなかんじがとくいだとはかぎらない。", english: "Just because someone is Japanese doesn't mean they're all good at kanji." },
        { japanese: "安いからといって、質が悪いわけではない。", furigana: "やすいからといって、しつがわるいわけではない。", english: "Just because it's cheap doesn't mean the quality is bad." },
        { japanese: "経験があるからといって、必ず成功するとは限らない。", furigana: "けいけんがあるからといって、かならずせいこうするとはかぎらない。", english: "Just because you have experience doesn't mean you'll definitely succeed." }
      ]}
    ]
  },
  {
    id: "n2-karaniwa", level: "N2", pattern: "～からには", title: "Now that / Since (with resolve)", short: "Having committed to something, states the natural and necessary consequence.",
    explanation: "～からには attaches to a plain-form phrase and means 'now that X is the case, one should/must do Y', often expressing the speaker's own resolve or sense of duty given the situation they're in.",
    usages: [
      { title: "Resulting resolve", examples: [
        { japanese: "引き受けたからには、最後まで責任を持ってやります。", furigana: "ひきうけたからには、さいごまでせきにんをもってやります。", english: "Now that I've taken this on, I'll see it through responsibly to the end." },
        { japanese: "プロを目指すからには、生半可な気持ちでは続けられない。", furigana: "プロをめざすからには、なまはんかなきもちではつづけられない。", english: "Since you're aiming to be a pro, you can't keep going with a half-hearted attitude." },
        { japanese: "留学するからには、しっかり勉強しなければならない。", furigana: "りゅうがくするからには、しっかりべんきょうしなければならない。", english: "Now that I'm studying abroad, I have to study hard." }
      ]}
    ]
  },
  {
    id: "n2-gyakuni", level: "N2", pattern: "逆に", title: "Conversely / On the contrary", short: "Introduces a fact that runs opposite to what was just said.",
    explanation: "逆に introduces a statement that is the reverse or opposite of what came before, similar to 'conversely' or 'on the contrary'. It can also modify a noun directly (逆の意見, 'the opposite opinion'), unlike some adverbs that only work sentence-initially.",
    usages: [
      { title: "Opposite outcome", examples: [
        { japanese: "彼を助けようとしたが、逆に迷惑をかけてしまった。", furigana: "かれをたすけようとしたが、ぎゃくにめいわくをかけてしまった。", english: "I tried to help him, but ended up causing trouble instead." },
        { japanese: "厳しくしすぎると、逆にやる気を失わせることもある。", furigana: "きびしくしすぎると、ぎゃくにやるきをうしなわせることもある。", english: "Being too strict can, conversely, sometimes cause someone to lose their motivation." },
        { japanese: "値下げしたら、逆に売り上げが落ちてしまった。", furigana: "ねさげしたら、ぎゃくにうりあげがおちてしまった。", english: "When we lowered the price, sales dropped instead, conversely." }
      ]}
    ]
  },
  {
    id: "n2-kotonaku", level: "N2", pattern: "～ことなく", title: "Without ever doing", short: "A formal way to say something never happened, not even once, over a period.",
    explanation: "～ことなく attaches to the dictionary form of a verb and means 'without ever doing X', a more formal and literary equivalent of ～ないで. It's often used to praise someone's unbroken persistence or resolve over a long period.",
    usages: [
      { title: "Never happening", examples: [
        { japanese: "彼は一度も諦めることなく、練習を続けた。", furigana: "かれはいちどもあきらめることなく、れんしゅうをつづけた。", english: "He continued practicing without ever giving up, not even once." },
        { japanese: "彼女は一度も休むことなく、十年間働き続けた。", furigana: "かのじょはいちどもやすむことなく、じゅうねんかんはたらきつづけた。", english: "She worked for ten years straight without ever taking a break, not even once." },
        { japanese: "彼女は誰にも頼ることなく、一人でやり遂げた。", furigana: "かのじょはだれにもたよることなく、ひとりでやりとげた。", english: "She saw it through entirely on her own, without relying on anyone." }
      ]}
    ]
  },
  {
    id: "n2-koto-niwa-naranai", level: "N2", pattern: "～ことにはならない", title: "That doesn't mean / It doesn't amount to", short: "Denies that a fact leads to the conclusion someone might assume.",
    explanation: "～ことにはならない follows a plain-form phrase and rejects a conclusion, saying that the situation described doesn't actually amount to, or justify, that claim — a way of pushing back against faulty reasoning.",
    usages: [
      { title: "Rejecting a conclusion", examples: [
        { japanese: "一度失敗したからといって、才能がないことにはならない。", furigana: "いちどしっぱいしたからといって、さいのうがないことにはならない。", english: "Failing once doesn't mean you have no talent." },
        { japanese: "謝ったからといって、それで済むことにはならない。", furigana: "あやまったからといって、それでずむことにはならない。", english: "Just because you apologized doesn't mean that settles the matter." },
        { japanese: "黙っていたからといって、認めたことにはならない。", furigana: "だまっていたからといって、みとめたことにはならない。", english: "Just because I stayed silent doesn't mean I admitted to it." }
      ]}
    ]
  },
  {
    id: "n2-saini", level: "N2", pattern: "～際に", title: "At the time of / On the occasion of", short: "A formal way to mark the moment or occasion something happens.",
    explanation: "～際に attaches to a noun or dictionary-form verb and means 'at the time of X' or 'on the occasion of X', more formal than とき — common in instructions, notices, and formal writing where a precise, businesslike tone is expected.",
    usages: [
      { title: "Formal occasion", examples: [
        { japanese: "お申し込みの際に、身分証明書をご用意ください。", furigana: "おもうしこみのさいに、みぶんしょうめいしょをごようういください。", english: "Please have your ID ready when applying." },
        { japanese: "出発する際に、忘れ物がないか確認してください。", furigana: "しゅっぱつするさいに、わすれものがないかかくにんしてください。", english: "Please check that you haven't forgotten anything before departing." },
        { japanese: "ご来店の際には、こちらのクーポンをご利用ください。", furigana: "ごらいてんのさいには、こちらのクーポンをごりようください。", english: "Please use this coupon when you visit our store." }
      ]}
    ]
  },
  {
    id: "n2-sarani", level: "N2", pattern: "さらに", title: "Furthermore / Even more", short: "Adds another point on top of what was already said, or intensifies it.",
    explanation: "さらに introduces additional information or says that a trend has intensified further, similar to 'furthermore' or 'even more so'. It can modify both verbs (adding action) and adjectives (intensifying a quality).",
    usages: [
      { title: "Adding more", examples: [
        { japanese: "台風が近づき、雨はさらに強くなった。", furigana: "たいふうがちかづき、あめはさらにつよくなった。", english: "As the typhoon approached, the rain grew even stronger." },
        { japanese: "問題はさらに複雑になっている。", furigana: "もんだいはさらにふくざつになっている。", english: "The problem has become even more complicated." },
        { japanese: "問題を解決するには、さらなる調査が必要だ。", furigana: "もんだいをかいけつするには、さらなるちょうさがひつようだ。", english: "Solving the problem will require further investigation." }
      ]}
    ]
  },
  {
    id: "n2-shikamo", level: "N2", pattern: "しかも", title: "Moreover / What's more", short: "Adds a surprising extra fact on top of what was already impressive or bad.",
    explanation: "しかも connects two sentences to add an additional, often surprising, fact to what was just said, similar to 'moreover' or 'and what's more'. The added fact usually intensifies the overall impression, whether positive or negative.",
    usages: [
      { title: "Adding a surprising fact", examples: [
        { japanese: "このレストランは安い。しかも、とても美味しい。", furigana: "このレストランはやすい。しかも、とてもおいしい。", english: "This restaurant is cheap. What's more, it's also very delicious." },
        { japanese: "彼は頭がいい。しかも、性格も優しい。", furigana: "かれはあたまがいい。しかも、せいかくもやさしい。", english: "He's smart. What's more, he's also kind-hearted." },
        { japanese: "彼は三か国語を話せる。しかも、全て独学だそうだ。", furigana: "かれはさんかこくごをはなせる。しかも、すべてどくがくだそうだ。", english: "He can speak three languages. What's more, apparently he taught himself all of them." }
      ]}
    ]
  },
  {
    id: "n2-shitagatte", level: "N2", pattern: "したがって", title: "Therefore / Accordingly", short: "A formal connector introducing a logical conclusion.",
    explanation: "したがって introduces a conclusion that logically follows from what was just stated, common in formal writing, reports, and speeches. It's a more formal register than だから, and rarely used in casual conversation.",
    usages: [
      { title: "Formal conclusion", examples: [
        { japanese: "今年は売り上げが下がった。したがって、来年度の予算を見直す必要がある。", furigana: "ことしはうりあげがさがった。したがって、らいねんどのよさんをみなおすひつようがある。", english: "Sales fell this year. Accordingly, we need to review next year's budget." },
        { japanese: "円安が進んだ。したがって、輸入品の価格が上昇している。", furigana: "えんやすがすすんだ。したがって、ゆにゅうひんのかかくがじょうしょうしている。", english: "The yen has weakened further. Accordingly, the prices of imported goods are rising." },
        { japanese: "この地域は人口が減少している。したがって、学校の統廃合が検討されている。", furigana: "このちいきはじんこうがげんしょうしている。したがって、がっこうのとうはいごうがけんとうされている。", english: "The population in this area is declining. Accordingly, the consolidation of schools is being considered." }
      ]}
    ]
  },
  {
    id: "n2-sunawachi", level: "N2", pattern: "すなわち", title: "In other words / Namely", short: "A formal restatement or clarification of what was just said.",
    explanation: "すなわち restates or clarifies the preceding statement in a formal, precise way, similar to 'in other words' or 'namely'. It's especially common when defining a term or clarifying exactly which thing is being referred to.",
    usages: [
      { title: "Formal restatement", examples: [
        { japanese: "彼は私の父の兄、すなわち伯父にあたります。", furigana: "かれはわたしのちちのあに、すなわちおじにあたります。", english: "He is my father's older brother, that is, my uncle." },
        { japanese: "この国の首都、すなわち政治の中心地について説明します。", furigana: "このくにのしゅと、すなわちせいじのちゅうしんちについてせつめいします。", english: "I will explain this country's capital, namely, its political center." },
        { japanese: "この計画の目的、すなわち地域経済の活性化について説明します。", furigana: "このけいかくのもくてき、すなわちちいきけいざいのかっせいかについてせつめいします。", english: "I will explain the purpose of this plan, namely, revitalizing the local economy." }
      ]}
    ]
  },
  {
    id: "n2-seizei", level: "N2", pattern: "せいぜい", title: "At most / At best", short: "Sets a low ceiling on an estimate or expectation.",
    explanation: "せいぜい modifies an estimate to say that it represents the maximum reasonable amount, and no more — often implying that even this maximum is actually quite modest. It can sound slightly dismissive when used to downplay someone's claim or ability.",
    usages: [
      { title: "Setting a ceiling", examples: [
        { japanese: "このアルバイトで稼げるのは、せいぜい月に五万円くらいだ。", furigana: "このアルバイトでかせげるのは、せいぜいつきにごまんえんくらいだ。", english: "With this part-time job, I can earn at most about 50,000 yen a month." },
        { japanese: "この仕事にかけられる時間は、せいぜい一時間だ。", furigana: "このしごとにかけられるじかんは、せいぜいいちじかんだ。", english: "The time I can spend on this task is at most one hour." },
        { japanese: "彼の実力では、せいぜい予選通過が限界だろう。", furigana: "かれのじつりょくでは、せいぜいよせんつうかがげんかいだろう。", english: "With his level of skill, getting past the qualifiers is probably the most he can hope for." }
      ]}
    ]
  },
  {
    id: "n2-semete", level: "N2", pattern: "せめて", title: "At least", short: "Names the minimum that would make an otherwise unsatisfying situation acceptable.",
    explanation: "せめて introduces the smallest amount or simplest action that the speaker would be satisfied with, given that a fuller wish can't be granted — a way of scaling down a hope to something more realistic.",
    usages: [
      { title: "Minimum acceptable amount", examples: [
        { japanese: "全部は無理でも、せめて半分は終わらせたい。", furigana: "ぜんぶはむりでも、せめてはんぶんはおわらせたい。", english: "Even if I can't do it all, I want to finish at least half." },
        { japanese: "旅行に行けないなら、せめて写真だけでも見たい。", furigana: "りょこうにいけないなら、せめてしゃしんだけでもみたい。", english: "If I can't go on the trip, I at least want to see the photos." },
        { japanese: "会えないなら、せめて電話だけでもしたい。", furigana: "あえないなら、せめてでんわだけでもしたい。", english: "If I can't see you, I at least want to call." }
      ]}
    ]
  },
  {
    id: "n2-souieba", level: "N2", pattern: "そういえば", title: "Come to think of it", short: "Suddenly recalls something related to the current topic.",
    explanation: "そういえば is used to introduce a related thought or memory that just came to mind, similar to 'come to think of it' or 'now that you mention it'. It's a natural conversational device for shifting to a related but separate topic.",
    usages: [
      { title: "Sudden recollection", examples: [
        { japanese: "そういえば、来週は田中さんの誕生日ですね。", furigana: "そういえば、らいしゅうはたなかさんのたんじょうびですね。", english: "Come to think of it, next week is Tanaka's birthday, isn't it?" },
        { japanese: "そういえば、あの本はもう返しましたか。", furigana: "そういえば、あのほんはもうかえしましたか。", english: "Come to think of it, have you already returned that book?" },
        { japanese: "そういえば、あの本はもう読み終わりましたか。", furigana: "そういえば、あのほんはもうよみおわりましたか。", english: "Come to think of it, have you finished reading that book yet?" }
      ]}
    ]
  },
  {
    id: "n2-sonoue", level: "N2", pattern: "その上", title: "Besides / What's more", short: "Adds one more point to a list of reasons or facts already given.",
    explanation: "その上 begins a new sentence to add one more fact on top of everything already mentioned, similar to しかも but slightly more neutral and measured in tone — common in both speech and writing.",
    usages: [
      { title: "Adding another point", examples: [
        { japanese: "彼は頭がいい。その上、性格も優しい。", furigana: "かれはあたまがいい。そのうえ、せいかくもやさしい。", english: "He's smart. Besides that, he's also kind-hearted." },
        { japanese: "駅から近い。その上、家賃も安い。", furigana: "えきからちかい。そのうえ、やちんもやすい。", english: "It's close to the station. Besides that, the rent is cheap too." },
        { japanese: "この部屋は静かだ。その上、日当たりもいい。", furigana: "このへやはしずかだ。そのうえ、ひあたりもいい。", english: "This room is quiet. On top of that, it also gets good sunlight." }
      ]}
    ]
  },
  {
    id: "n2-soretomo", level: "N2", pattern: "それとも", title: "Or / Or else", short: "Presents a second alternative in a choice between two options.",
    explanation: "それとも connects two questions or options to present a choice, similar to 'or' when offering an alternative — it can only connect questions or implied questions, unlike や or とか which connect nouns in a plain list.",
    usages: [
      { title: "Offering an alternative", examples: [
        { japanese: "コーヒーにしますか。それとも、紅茶にしますか。", furigana: "コーヒーにしますか。それとも、こうちゃにしますか。", english: "Will you have coffee? Or would you rather have tea?" },
        { japanese: "電車で行きますか。それとも、バスにしますか。", furigana: "でんしゃでいきますか。それとも、バスにしますか。", english: "Will you go by train? Or will you take the bus instead?" },
        { japanese: "今日行きますか。それとも、明日にしますか。", furigana: "きょういきますか。それとも、あしたにしますか。", english: "Will you go today? Or will you make it tomorrow?" }
      ]}
    ]
  },
  {
    id: "n2-sorenanoni", level: "N2", pattern: "それなのに", title: "And yet / Despite that", short: "Expresses frustration or disbelief that the result contradicted expectations.",
    explanation: "それなのに begins a new sentence to point out a frustrating contrast with what was just said, carrying a stronger emotional tone than でも or しかし — it signals genuine disappointment or disbelief, not just neutral contrast.",
    usages: [
      { title: "Frustrated contrast", examples: [
        { japanese: "一生懸命勉強した。それなのに、試験に落ちてしまった。", furigana: "いっしょうけんめいべんきょうした。それなのに、しけんにおちてしまった。", english: "I studied so hard. And yet, I still failed the exam." },
        { japanese: "彼は忙しいと言っていた。それなのに、遊びに出かけたらしい。", furigana: "かれはいそがしいといっていた。それなのに、あそびにでかけたらしい。", english: "He said he was busy. And yet, apparently he went out to have fun." },
        { japanese: "彼には何度も注意した。それなのに、また同じ失敗をした。", furigana: "かれにはなんどもちゅういした。それなのに、またおなじしっぱいをした。", english: "I warned him many times. And yet, he made the same mistake again." }
      ]}
    ]
  },
  {
    id: "n2-sorenara", level: "N2", pattern: "それなら", title: "In that case / If so", short: "Responds to what was just said by suggesting the next logical step.",
    explanation: "それなら refers back to what the other person just said and proposes a course of action or conclusion that follows from it, similar to 'if that's the case, then...'. It's a responsive expression, always reacting to information just given.",
    usages: [
      { title: "Responding to a situation", examples: [
        { japanese: "「明日は雨だそうです。」「それなら、傘を持って行きましょう。」", furigana: "「あしたはあめだそうです。」「それなら、かさをもっていきましょう。」", english: "\"I heard it will rain tomorrow.\" \"In that case, let's take an umbrella.\"" },
        { japanese: "「もう疲れました。」「それなら、少し休みましょう。」", furigana: "「もうつかれました。」「それなら、すこしやすみましょう。」", english: "\"I'm already tired.\" \"In that case, let's rest a bit.\"" },
        { japanese: "「電車が止まっているそうです。」「それなら、バスで行きましょう。」", furigana: "「でんしゃがとまっているそうです。」「それなら、バスでいきましょう。」", english: "\"I heard the trains have stopped.\" \"In that case, let's go by bus.\"" }
      ]}
    ]
  },
  {
    id: "n2-soreni-shitemo", level: "N2", pattern: "それにしても", title: "Even so / Still", short: "Concedes a point, but reacts that the degree of something is still surprising.",
    explanation: "それにしても acknowledges a known fact or excuse, but reacts that even accounting for it, something is still surprisingly extreme — a way of registering continued surprise even after context has been given.",
    usages: [
      { title: "Reacting despite context", examples: [
        { japanese: "今日は忙しいと聞いていたが、それにしても電話に出なさすぎる。", furigana: "きょうはいそがしいときいていたが、それにしてもでんわにでなさすぎる。", english: "I heard you were busy today, but even so, you're really not answering your phone at all." },
        { japanese: "道が混んでいるとは聞いていたが、それにしても遅すぎる。", furigana: "みちがこんでいるとはきいていたが、それにしてもおそすぎる。", english: "I'd heard the roads were busy, but even so, this is too slow." },
        { japanese: "値上げは仕方ないと分かっているが、それにしても高すぎる。", furigana: "ねあげはしかたないとわかっているが、それにしてもたかすぎる。", english: "I understand the price increase can't be helped, but even so, this is too expensive." }
      ]}
    ]
  },
  {
    id: "n2-dakeni", level: "N2", pattern: "～だけに / ～だけあって / ～だけのことはある", title: "Precisely because / As one would expect from", short: "A fact makes the result all the more understandable, impressive, or disappointing.",
    explanation: "～だけに and ～だけあって both mean 'precisely because of X' — the result makes sense given that fact, whether it's impressively living up to expectations or disappointingly falling short. ～だけのことはある is a related set phrase meaning 'it shows; no wonder', specifically praising something as living up to its reputation.",
    usages: [
      { title: "Result matches the cause (だけに / だけあって)", examples: [
        { japanese: "国際大会だけに、レベルがとても高い。", furigana: "こくさいたいかいだけに、レベルがとてもたかい。", english: "Precisely because it's an international competition, the level is very high." },
        { japanese: "彼は経験が長いだけあって、説明がとても分かりやすい。", furigana: "かれはけいけんがながいだけあって、せつめいがとてもわかりやすい。", english: "As you'd expect from someone with a lot of experience, his explanations are very easy to understand." },
        { japanese: "長年準備してきただけに、悔しさもひとしおだ。", furigana: "ながねんじゅんびしてきただけに、くやしさもひとしおだ。", english: "Precisely because I'd been preparing for years, the disappointment is all the greater." }
      ]},
      { title: "Living up to expectations (だけのことはある)", examples: [
        { japanese: "さすがプロだけのことはある。演技が素晴らしい。", furigana: "さすがプロだけのことはある。えんぎがすばらしい。", english: "No wonder — that's what you'd expect from a pro. The performance is wonderful." }
      ]}
    ]
  },
  {
    id: "n2-tatte", level: "N2", pattern: "～たって", title: "Even if / No matter (casual)", short: "The casual spoken equivalent of ～ても.",
    explanation: "～たって is the casual, contracted spoken form of ～ても, meaning 'even if' or 'no matter how much'. It's common in everyday conversation and often carries a slightly stubborn or resigned tone, especially when repeated for emphasis (何度謝ったって, 'no matter how many times I apologize').",
    usages: [
      { title: "Casual concession", examples: [
        { japanese: "いくら急いだって、もう間に合わないよ。", furigana: "いくらいそいだって、もうまにあわないよ。", english: "No matter how much you rush, you're not going to make it now." },
        { japanese: "そんなに謝ったって、許さないよ。", furigana: "そんなにあやまったって、ゆるさないよ。", english: "Even if you apologize that much, I'm not going to forgive you." },
        { japanese: "どんなに頼んだって、彼は首を縦に振らないだろう。", furigana: "どんなにたのんだって、かれはくびをたてにふらないだろう。", english: "No matter how much you ask, he probably won't agree." }
      ]}
    ]
  },
  {
    id: "n2-tekoso", level: "N2", pattern: "～てこそ", title: "Only by doing / It's precisely by doing", short: "One thing truly becomes possible or meaningful only once another is done.",
    explanation: "～てこそ attaches to the て-form of a verb and emphasizes that the following positive result is only achievable by doing this specific action — remove the action, and the result wouldn't follow. It always pairs with a positive, often somewhat idealistic, outcome.",
    usages: [
      { title: "Necessary precondition", examples: [
        { japanese: "苦労してこそ、本当の喜びが分かる。", furigana: "くろうしてこそ、ほんとうのよろこびがわかる。", english: "It's only through hardship that you come to understand true joy." },
        { japanese: "自分の目で確かめてこそ、本当のことが分かる。", furigana: "じぶんのめでたしかめてこそ、ほんとうのことがわかる。", english: "It's only by confirming it with your own eyes that you can know the truth." },
        { japanese: "失敗を経験してこそ、本当の成長がある。", furigana: "しっぱいをけいけんしてこそ、ほんとうのせいちょうがある。", english: "It's only by experiencing failure that real growth happens." }
      ]}
    ]
  },
  {
    id: "n2-deshikanai", level: "N2", pattern: "～でしかない", title: "Nothing but / Merely", short: "Dismisses something as being no more than a minor or unimpressive category.",
    explanation: "～でしかない follows a noun and means 'is nothing more than X', downplaying its importance or scale, similar to ～に過ぎない. It often appears in a slightly dismissive or corrective tone, pushing back against an inflated view of something.",
    usages: [
      { title: "Downplaying importance", examples: [
        { japanese: "彼の話は単なる噂でしかない。", furigana: "かれのはなしはたんなるうわさでしかない。", english: "What he's saying is nothing but a rumor." },
        { japanese: "彼の説明は言い訳でしかない。", furigana: "かれのせつめいはいいわけでしかない。", english: "His explanation is nothing but an excuse." },
        { japanese: "それは彼の勝手な想像でしかない。", furigana: "それはかれのかってなそうぞうでしかない。", english: "That's nothing but his own arbitrary imagination." }
      ]}
    ]
  },
  {
    id: "n2-hairarenai", level: "N2", pattern: "～てはいられない", title: "Can't afford to keep / Can't just", short: "The current situation is urgent enough that a habitual action must stop.",
    explanation: "～てはいられない attaches to the て-form of a verb and means 'can't afford to keep doing X' — the urgency of the situation makes continuing that habitual or relaxed action impossible. It's specifically about urgency overriding routine, distinct from ～ずにはいられない, which is about an urge overriding self-control.",
    usages: [
      { title: "Urgency overriding habit", examples: [
        { japanese: "もう時間がない。のんびりしてはいられない。", furigana: "もうじかんがない。のんびりしてはいられない。", english: "There's no more time. I can't just relax." },
        { japanese: "赤字が続いているのに、のんきに構えてはいられない。", furigana: "あかじがつづいているのに、のんきにかまえてはいられない。", english: "With the losses continuing, we can't afford to just sit back calmly." },
        { japanese: "こんな大事な時に、休んではいられない。", furigana: "こんなだいじなときに、やすんではいられない。", english: "At a critical time like this, I can't afford to rest." }
      ]}
    ]
  },
  {
    id: "n2-dewanaika", level: "N2", pattern: "～ではないか", title: "Isn't it? / Look, it's ...!", short: "Points out an obvious fact, or makes a firm suggestion.",
    explanation: "～ではないか (casual じゃないか) points out something the speaker finds obvious or surprising, or, used with a volitional verb (行こうではないか), makes a firm, almost rallying suggestion like 'let's...'. The tone ranges from mild surprise to genuine indignation depending on context.",
    usages: [
      { title: "Pointing out the obvious", examples: [
        { japanese: "あれ、電気がついているではないか。", furigana: "あれ、でんきがついているではないか。", english: "Huh, the lights are on, aren't they!" },
        { japanese: "何だ、できるではないか。", furigana: "なんだ、できるではないか。", english: "Well look at that, you can actually do it!" }
      ]},
      { title: "Firm suggestion", examples: [
        { japanese: "みんなで力を合わせようではないか。", furigana: "みんなでちからをあわせようではないか。", english: "Let's all join forces together, shall we." }
      ]}
    ]
  },
  {
    id: "n2-tewanaranai", level: "N2", pattern: "～てはならない", title: "Must not (formal)", short: "A formal, written prohibition.",
    explanation: "～てはならない is the formal, written equivalent of ～てはいけない, commonly seen in rules, laws, and official documents. It carries a stronger, more absolute prohibition than casual speech would use, and rarely appears in everyday conversation.",
    usages: [
      { title: "Formal prohibition", examples: [
        { japanese: "この装置には絶対に触れてはならない。", furigana: "このそうちにはぜったいにふれてはならない。", english: "You must never touch this device." },
        { japanese: "子供を一人で危険な場所に行かせてはならない。", furigana: "こどもをひとりできけんなばしょにいかせてはならない。", english: "You must not let a child go to a dangerous place alone." },
        { japanese: "個人情報は決して他人に教えてはならない。", furigana: "こじんじょうほうはけっしてたにんにおしえてはならない。", english: "Personal information must never be shared with others." }
      ]}
    ]
  },
  {
    id: "n2-toiukotoha", level: "N2", pattern: "～ということは", title: "That means / Which means", short: "Draws out the logical implication of a fact just mentioned.",
    explanation: "～ということは restates a fact as a premise and then draws its logical implication, similar to 'that means...' or 'which implies that...'. It signals that the speaker is actively reasoning through what a fact suggests, rather than just reporting new information.",
    usages: [
      { title: "Drawing an implication", examples: [
        { japanese: "彼がまだ来ないということは、道に迷っているのかもしれない。", furigana: "かれがまだこないということは、みちにまよっているのかもしれない。", english: "The fact that he still hasn't come might mean he's lost." },
        { japanese: "返事がないということは、断られたということだろう。", furigana: "へんじがないということは、ことわられたということだろう。", english: "The fact that there's no reply probably means we've been turned down." },
        { japanese: "電気がついているということは、誰か家にいるのだろう。", furigana: "でんきがついているということは、だれかいえにいるのだろう。", english: "The fact that the lights are on probably means someone's home." }
      ]}
    ]
  },
  {
    id: "n2-toitta", level: "N2", pattern: "～といった", title: "Such as / Like", short: "Gives representative examples from a category.",
    explanation: "～といった follows a couple of example nouns and means 'things like X and Y', giving representative examples of a larger, often unstated category. It's slightly more formal than とか, and works well when listing just enough examples to give a general impression.",
    usages: [
      { title: "Giving examples", examples: [
        { japanese: "すし、天ぷらといった日本料理が好きです。", furigana: "すし、てんぷらといったにほんりょうりがすきです。", english: "I like Japanese food such as sushi and tempura." },
        { japanese: "野球やサッカーといったスポーツが人気だ。", furigana: "やきゅうやサッカーといったスポーツがにんきだ。", english: "Sports such as baseball and soccer are popular." },
        { japanese: "京都や奈良といった歴史的な街を訪れたい。", furigana: "きょうとやならといったれきしてきなまちをおとずれたい。", english: "I want to visit historic cities such as Kyoto and Nara." }
      ]}
    ]
  },
  {
    id: "n2-douse", level: "N2", pattern: "どうせ", title: "Anyway / In the end", short: "A resigned tone that the outcome was inevitable regardless of effort.",
    explanation: "どうせ signals resignation, implying that no matter what is done, the outcome will be the same anyway — often used with a slightly negative or defeatist tone. It can also soften a decision by suggesting there was never really a choice to begin with.",
    usages: [
      { title: "Resigned inevitability", examples: [
        { japanese: "どうせ負けるんだから、もう練習しても無駄だ。", furigana: "どうせまけるんだから、もうれんしゅうしてもむだだ。", english: "We're going to lose anyway, so practicing more is pointless." },
        { japanese: "どうせ雨が降るなら、傘を持って行こう。", furigana: "どうせあめがふるなら、かさをもっていこう。", english: "If it's going to rain anyway, let's bring an umbrella." },
        { japanese: "どうせ引っ越すなら、駅に近い所がいい。", furigana: "どうせひっこすなら、えきにちかいところがいい。", english: "If I'm going to move anyway, I'd prefer somewhere close to the station." }
      ]}
    ]
  },
  {
    id: "n2-douyara", level: "N2", pattern: "どうやら", title: "It seems / Apparently", short: "A cautious guess based on indirect evidence.",
    explanation: "どうやら often pairs with らしい or ようだ at the end of the sentence to make a somewhat confident but still tentative guess based on the evidence at hand — the speaker is fairly sure, but stops short of stating it as certain fact.",
    usages: [
      { title: "Tentative guess", examples: [
        { japanese: "どうやら道に迷ってしまったようだ。", furigana: "どうやらみちにまよってしまったようだ。", english: "It seems we've gotten lost." },
        { japanese: "どうやら道を間違えたらしい。", furigana: "どうやらみちをまちがえたらしい。", english: "It seems we've apparently taken the wrong road." },
        { japanese: "どうやら彼は約束を忘れているようだ。", furigana: "どうやらかれはやくそくをわすれているようだ。", english: "It seems like he's forgotten our appointment." }
      ]}
    ]
  },
  {
    id: "n2-dokorodewanai", level: "N2", pattern: "～どころではない", title: "This is not the time for / Far from being able to", short: "The current situation makes an otherwise normal activity completely impossible.",
    explanation: "～どころではない follows a noun or verb and means the current circumstances make that activity completely out of the question — 'this is no time for X'. It's stronger than just being busy; it implies the named activity is genuinely unthinkable given what's happening.",
    usages: [
      { title: "Out of the question", examples: [
        { japanese: "締め切りが近くて、旅行どころではない。", furigana: "しめきりがちかくて、りょこうどころではない。", english: "The deadline is close, so this is no time for a trip." },
        { japanese: "赤ちゃんが泣き続けていて、ゆっくり食事どころではなかった。", furigana: "あかちゃんがなきつづけていて、ゆっくりしょくじどころではなかった。", english: "The baby wouldn't stop crying, so it was no time for a leisurely meal." },
        { japanese: "頭が痛くて、勉強どころではなかった。", furigana: "あたまがいたくて、べんきょうどころではなかった。", english: "My head hurt so much that studying was out of the question." }
      ]}
    ]
  },
  {
    id: "n2-toshitewa", level: "N2", pattern: "～としては", title: "As for / In the capacity of", short: "Frames a statement from the standpoint of a particular group or role.",
    explanation: "～としては follows a noun (often a role, group, or category) and frames the following statement from that specific standpoint, similar to 'as for X' or 'speaking as X'. It clarifies whose perspective a judgment is coming from, which may differ from another party's view.",
    usages: [
      { title: "Framing a standpoint", examples: [
        { japanese: "会社としては、その提案に反対です。", furigana: "かいしゃとしては、そのていあんにはんたいです。", english: "As a company, we are opposed to that proposal." },
        { japanese: "母親としては、子供の将来が心配でならない。", furigana: "ははおやとしては、こどものしょうらいがしんぱいでならない。", english: "As a mother, I can't help but worry about my child's future." },
        { japanese: "個人としては賛成だが、部署の意見はまだまとまっていない。", furigana: "こじんとしてはさんせいだが、ぶしょのいけんはまだまとまっていない。", english: "Personally, I'm in favor, but the department's opinion hasn't been settled yet." }
      ]}
    ]
  },
  {
    id: "n2-nao", level: "N2", pattern: "なお", title: "Furthermore / Please note", short: "A formal transition adding an extra note or continuing detail.",
    explanation: "なお is used in formal writing and announcements to add a supplementary note, or to say a state continues to be true, similar to 'furthermore' or 'please note that'. It's a standard closing device in official notices, tacking on an important detail after the main point.",
    usages: [
      { title: "Adding a formal note", examples: [
        { japanese: "会議は三時に始まります。なお、資料は当日配布します。", furigana: "かいぎはさんじにはじまります。なお、しりょうはとうじつはいふします。", english: "The meeting starts at 3 o'clock. Please note that materials will be handed out on the day." },
        { japanese: "セール期間は今週いっぱいです。なお、返品はできませんのでご注意ください。", furigana: "セールきかんはこんしゅういっぱいです。なお、へんぴんはできませんのでごちゅういください。", english: "The sale runs through the end of this week. Please note that returns are not accepted." },
        { japanese: "申し込みは明日までです。なお、定員に達し次第、締め切ります。", furigana: "もうしこみはあしたまでです。なお、ていいんにたっししだい、しめきります。", english: "Applications are open until tomorrow. Please note that we will close as soon as capacity is reached." }
      ]}
    ]
  },
  {
    id: "n2-nioujite", level: "N2", pattern: "～に応じて", title: "Depending on / In accordance with", short: "An amount or approach adjusts to match a varying factor.",
    explanation: "～に応じて follows a noun representing a variable factor (need, situation, ability) and means that something adjusts or is decided according to it — the outcome scales or changes to fit that factor, rather than staying fixed.",
    usages: [
      { title: "Adjusting to a factor", examples: [
        { japanese: "収入に応じて、税金の額が変わります。", furigana: "しゅうにゅうにおうじて、ぜいきんのがくがかわります。", english: "The amount of tax changes according to income." },
        { japanese: "お客様のご要望に応じて、内容を変更いたします。", furigana: "おきゃくさまのごようぼうにおうじて、ないようをへんこういたします。", english: "We will change the content in accordance with the customer's request." },
        { japanese: "経験に応じて、給料が決まります。", furigana: "けいけんにおうじて、きゅうりょうがきまります。", english: "Salary is decided according to experience." }
      ]}
    ]
  },
  {
    id: "n2-nikakawarazu", level: "N2", pattern: "～にかかわらず", title: "Regardless of", short: "A condition or category has no effect on the outcome.",
    explanation: "～にかかわらず follows a noun (often a pair of opposites like 天気, 経験の有無) to say that the outcome is the same no matter which case applies — the factor named turns out to make no difference at all.",
    usages: [
      { title: "No effect on outcome", examples: [
        { japanese: "天気にかかわらず、試合は行われます。", furigana: "てんきにかかわらず、しあいはおこなわれます。", english: "The match will be held regardless of the weather." },
        { japanese: "経験の有無にかかわらず、誰でも応募できます。", furigana: "けいけんのうむにかかわらず、だれでもおうぼできます。", english: "Anyone can apply, regardless of experience." },
        { japanese: "年齢にかかわらず、誰でも参加できます。", furigana: "ねんれいにかかわらず、だれでもさんかできます。", english: "Anyone can participate, regardless of age." }
      ]}
    ]
  },
  {
    id: "n2-nikimatteiru", level: "N2", pattern: "～に決まっている", title: "I'm sure that / It's bound to be", short: "States a confident conviction as if it were obviously true.",
    explanation: "～に決まっている attaches to a plain-form phrase and expresses strong, almost obvious confidence that something is true — the speaker isn't just guessing, they consider the conclusion practically self-evident given the circumstances.",
    usages: [
      { title: "Confident conviction", examples: [
        { japanese: "こんな高いバッグ、偽物に決まっている。", furigana: "こんなたかいバッグ、にせものにきまっている。", english: "A bag this expensive — it's bound to be a fake." },
        { japanese: "そんなに練習したのだから、上手になるに決まっている。", furigana: "そんなにれんしゅうしたのだから、じょうずになるにきまっている。", english: "You practiced that much, so of course you're bound to get good at it." },
        { japanese: "そんなに練習もせずに勝てるわけがない。負けるに決まっている。", furigana: "そんなにれんしゅうもせずにかてるわけがない。まけるにきまっている。", english: "There's no way you can win without practicing that much. You're bound to lose." }
      ]}
    ]
  },
  {
    id: "n2-nisaishite", level: "N2", pattern: "～に際して", title: "On the occasion of / When", short: "A formal way to mark a significant, one-time event as the setting for an action.",
    explanation: "～に際して follows a noun describing a significant event (marriage, graduation, launch) and means 'on the occasion of X', used in formal speeches and writing to mark an important, often one-time, moment as the context for what follows.",
    usages: [
      { title: "Significant occasion", examples: [
        { japanese: "新しいサービスの開始に際して、一言ご挨拶申し上げます。", furigana: "あたらしいサービスのかいしにさいして、ひとことごあいさつもうしあげます。", english: "On the occasion of launching this new service, I would like to say a few words." },
        { japanese: "契約に際して、いくつか確認しておきたいことがあります。", furigana: "けいやくにさいして、いくつかかくにんしておきたいことがあります。", english: "When it comes to the contract, there are a few things I'd like to confirm." },
        { japanese: "卒業に際して、恩師に感謝の手紙を書いた。", furigana: "そつぎょうにさいして、おんしにかんしゃのてがみをかいた。", english: "On the occasion of graduating, I wrote a letter of thanks to my mentor." }
      ]}
    ]
  },
  {
    id: "n2-nisakidachi", level: "N2", pattern: "～に先立ち / ～に先立って", title: "Prior to / Ahead of", short: "One formal event is carried out before a bigger one, in preparation for it.",
    explanation: "～に先立ち follows a noun and means 'ahead of X' or 'in advance of X', used in formal contexts to describe preparatory steps taken before a larger event — common in ceremonies, product launches, and official proceedings.",
    usages: [
      { title: "Formal preparation", examples: [
        { japanese: "開店に先立ち、内覧会が行われた。", furigana: "かいてんにさきだち、ないらんかいがおこなわれた。", english: "Ahead of the opening, a preview event was held." },
        { japanese: "工事に先立って、近隣住民への説明会が開かれた。", furigana: "こうじにさきだって、きんりんじゅうみんへのせつめいかいがひらかれた。", english: "Ahead of the construction, an information session for nearby residents was held." },
        { japanese: "会議に先立って、資料が配布された。", furigana: "かいぎにさきだって、しりょうがはいふされた。", english: "Materials were distributed ahead of the meeting." }
      ]}
    ]
  },
  {
    id: "n2-nisouinai", level: "N2", pattern: "～に相違ない", title: "There is no doubt that (formal)", short: "A formal, confident statement of certainty.",
    explanation: "～に相違ない is a formal written equivalent of ～に違いない, expressing strong certainty that something is true — common in reports, investigations, and formal writing rather than everyday conversation.",
    usages: [
      { title: "Formal certainty", examples: [
        { japanese: "この筆跡は本人のものに相違ない。", furigana: "このひっせきはほんにんのものにそういない。", english: "There is no doubt that this handwriting belongs to the person themselves." },
        { japanese: "この報告は事実に相違ない。", furigana: "このほうこくはじじつにそういない。", english: "There's no doubt this report is accurate." },
        { japanese: "この計画には何か裏があるに相違ない。", furigana: "このけいかくにはなにかうらがあるにそういない。", english: "There's no doubt this plan has something behind it." }
      ]}
    ]
  },
  {
    id: "n2-nihokanaranai", level: "N2", pattern: "～にほかならない", title: "Nothing but / None other than", short: "Firmly states that something is exactly this, and nothing else.",
    explanation: "～にほかならない follows a noun and firmly asserts that it is exactly and only that thing, similar to 'is nothing other than' or 'is precisely'. It's often used to give credit or assign blame decisively, ruling out any other explanation.",
    usages: [
      { title: "Firm identification", examples: [
        { japanese: "彼が成功したのは、努力の結果にほかならない。", furigana: "かれがせいこうしたのは、どりょくのけっかにほかならない。", english: "His success is nothing other than the result of hard work." },
        { japanese: "彼女がここまで来られたのは、家族の支えにほかならない。", furigana: "かのじょがここまでこられたのは、かぞくのささえにほかならない。", english: "The reason she made it this far is nothing other than her family's support." },
        { japanese: "この事故の原因は、整備不足にほかならない。", furigana: "このじこのげんいんは、せいびぶそくにほかならない。", english: "The cause of this accident is nothing other than insufficient maintenance." }
      ]}
    ]
  },
  {
    id: "n2-nebanaranai", level: "N2", pattern: "～ねばならない", title: "Must (formal)", short: "A formal, literary way to state an obligation.",
    explanation: "～ねばならない is the formal, literary equivalent of ～なければならない, common in written Japanese, speeches, and set phrases — it sounds noticeably more solemn or old-fashioned than the everyday form.",
    usages: [
      { title: "Formal obligation", examples: [
        { japanese: "私たちは自然を守らねばならない。", furigana: "わたしたちはしぜんをまもらねばならない。", english: "We must protect nature." },
        { japanese: "規則は守らねばならない。", furigana: "きそくはまもらねばならない。", english: "Rules must be followed." },
        { japanese: "私たちは次世代のために行動せねばならない。", furigana: "わたしたちはじせだいのためにこうどうせねばならない。", english: "We must act for the sake of the next generation." }
      ]}
    ]
  },
  {
    id: "n2-nominarazu", level: "N2", pattern: "～のみならず", title: "Not only ... but also (formal)", short: "A formal way to extend a statement beyond its first, obvious scope.",
    explanation: "～のみならず is a formal equivalent of ～だけでなく, extending a statement to include an additional, often broader or more surprising, point beyond the first one mentioned.",
    usages: [
      { title: "Formal extension", examples: [
        { japanese: "この問題は国内のみならず、世界中で議論されている。", furigana: "このもんだいはこくないのみならず、せかいじゅうでぎろんされている。", english: "This issue is being debated not only domestically but around the world." },
        { japanese: "彼は英語のみならず、フランス語も話せる。", furigana: "かれはえいごのみならず、フランスごもはなせる。", english: "He can speak not only English but French as well." },
        { japanese: "この選手は国内のみならず、海外でも高く評価されている。", furigana: "このせんしゅはこくないのみならず、かいがいでもたかくひょうかされている。", english: "This athlete is highly regarded not only domestically but overseas as well." }
      ]}
    ]
  },
  {
    id: "n2-hatomokaku", level: "N2", pattern: "～はともかく", title: "Regardless of / Setting aside", short: "Sets one topic aside to focus attention on a more relevant one.",
    explanation: "～はともかく follows a noun to set that topic aside for now, shifting focus to something more important or relevant to the current discussion — it doesn't dismiss the set-aside topic as unimportant, just as not the priority right now.",
    usages: [
      { title: "Setting a topic aside", examples: [
        { japanese: "味はともかく、見た目はとても綺麗です。", furigana: "あじはともかく、みためはとてもきれいです。", english: "Setting the taste aside, it looks very beautiful at least." },
        { japanese: "値段はともかく、まずは品質を確認しよう。", furigana: "ねだんはともかく、まずはひんしつをかくにんしよう。", english: "Setting the price aside for now, let's first check the quality." },
        { japanese: "冗談はともかく、真剣に話し合いましょう。", furigana: "じょうだんはともかく、しんけんにはなしあいましょう。", english: "Jokes aside, let's talk about this seriously." }
      ]}
    ]
  },
  {
    id: "n2-hanmen", level: "N2", pattern: "～反面", title: "On the other hand / While also", short: "Presents a second, contrasting quality of the same subject.",
    explanation: "～反面 connects two clauses describing two different, often opposing, sides or qualities of a single subject — praising one aspect while acknowledging a downside, or vice versa, within the same sentence.",
    usages: [
      { title: "Two sides of one thing", examples: [
        { japanese: "この仕事は給料がいい反面、休みが少ない。", furigana: "このしごとはきゅうりょうがいいはんめん、やすみがすくない。", english: "This job pays well, but on the other hand, there are few days off." },
        { japanese: "都会は便利な反面、自然が少ない。", furigana: "とかいはべんりなはんめん、しぜんがすくない。", english: "The city is convenient, but on the other hand, there's little nature." },
        { japanese: "在宅勤務は自由な反面、自己管理が難しい。", furigana: "ざいたくきんむはじゆうなはんめん、じこかんりがむずかしい。", english: "Working from home offers freedom, but on the other hand, self-management is difficult." }
      ]}
    ]
  },
  {
    id: "n2-burini", level: "N2", pattern: "～ぶりに", title: "For the first time in", short: "Says how much time has passed since something last happened.",
    explanation: "～ぶりに attaches to a length of time and means 'for the first time in that long', emphasizing the gap since the last occurrence. It's often used with a sense of nostalgia or pleasant surprise at how much time has passed.",
    usages: [
      { title: "Time since last occurrence", examples: [
        { japanese: "三年ぶりに、故郷に帰った。", furigana: "さんねんぶりに、こきょうにかえった。", english: "I went back to my hometown for the first time in three years." },
        { japanese: "久しぶりに彼女に会った。", furigana: "ひさしぶりにかのじょにあった。", english: "I met her for the first time in a long while." },
        { japanese: "十年ぶりに同窓会に参加した。", furigana: "じゅうねんぶりにどうそうかいにさんかした。", english: "I attended the class reunion for the first time in ten years." }
      ]}
    ]
  },
  {
    id: "n2-mushiro", level: "N2", pattern: "むしろ", title: "Rather / If anything", short: "Corrects a comparison by favoring the second option over the first.",
    explanation: "むしろ signals that, between two options being compared, the second one is actually more accurate or preferable, similar to 'rather' or 'if anything'. It's often paired with というより to explicitly frame the comparison being corrected.",
    usages: [
      { title: "Preferring the alternative", examples: [
        { japanese: "彼は怒っているというより、むしろ悲しんでいるようだった。", furigana: "かれはおこっているというより、むしろかなしんでいるようだった。", english: "He didn't seem so much angry as, if anything, sad." },
        { japanese: "無理に励ますより、むしろ黙って見守るほうがいい。", furigana: "むりにはげますより、むしろだまってみまもるほうがいい。", english: "Rather than forcing encouragement on someone, it's often better to just watch over them quietly." },
        { japanese: "彼は天才というより、むしろ努力家だと思う。", furigana: "かれはてんさいというより、むしろどりょくかだとおもう。", english: "I think he's less a genius and more, if anything, a hard worker." }
      ]}
    ]
  },
  {
    id: "n2-monodakara", level: "N2", pattern: "～ものだから", title: "Because / It's just that", short: "Gives a reason, often as an excuse for an unintended result.",
    explanation: "～ものだから attaches to a plain-form phrase and gives a reason, often used to excuse or explain an unintended action or outcome — it carries a slightly apologetic or self-justifying tone, unlike neutral から.",
    usages: [
      { title: "Explaining an outcome", examples: [
        { japanese: "急いでいたものだから、鍵をかけるのを忘れてしまった。", furigana: "いそいでいたものだから、かぎをかけるのをわすれてしまった。", english: "I was in such a hurry that I forgot to lock the door." },
        { japanese: "道が分からなかったものだから、遅刻してしまった。", furigana: "みちがわからなかったものだから、ちこくしてしまった。", english: "It's just that I didn't know the way, so I ended up being late." },
        { japanese: "隣の部屋がうるさかったものだから、よく眠れなかった。", furigana: "となりのへやがうるさかったものだから、よくねむれなかった。", english: "The room next door was so noisy that I couldn't sleep well." }
      ]}
    ]
  },
  {
    id: "n2-yousuruni", level: "N2", pattern: "要するに", title: "In short / In other words", short: "Summarizes a longer explanation into its essential point.",
    explanation: "要するに introduces a concise summary of what was just said, similar to 'in short' or 'to put it simply'. It's a useful device for wrapping up a longer explanation into its single essential point.",
    usages: [
      { title: "Summarizing", examples: [
        { japanese: "説明が長くなりましたが、要するに時間が足りないということです。", furigana: "せつめいがながくなりましたが、ようするにじかんがたりないということです。", english: "The explanation got long, but in short, we don't have enough time." },
        { japanese: "彼が言いたいのは、要するにお金が足りないということだ。", furigana: "かれがいいたいのは、ようするにおかねがたりないということだ。", english: "What he's trying to say is, in short, that there isn't enough money." },
        { japanese: "要するに、彼はやる気がないということだ。", furigana: "ようするに、かれはやるきがないということだ。", english: "In short, what it comes down to is that he has no motivation." }
      ]}
    ]
  },
  {
    id: "n2-wo-nozoite", level: "N2", pattern: "～を除いて", title: "Except for / With the exception of", short: "Excludes one item from an otherwise general statement.",
    explanation: "～を除いて follows a noun to exclude it from the statement that follows, similar to 'except for X' or 'apart from X'. It's a neutral, precise way to carve out a single exception from an otherwise general statement.",
    usages: [
      { title: "Excluding an item", examples: [
        { japanese: "日曜日を除いて、毎日開いています。", furigana: "にちようびをのぞいて、まいにちひらいています。", english: "We're open every day except Sunday." },
        { japanese: "この会員特典は、一部の商品を除いて全て適用されます。", furigana: "このかいいんとくてんは、いちぶのしょうひんをのぞいてすべててきようされます。", english: "This membership benefit applies to everything except a few select products." },
        { japanese: "田中さんを除いて、全員が賛成した。", furigana: "たなかさんをのぞいて、ぜんいんがさんせいした。", english: "Everyone except Tanaka agreed." }
      ]}
    ]
  }
];

const N1_GRAMMAR = [
  {
    id: "n1-ya-ina-ya", level: "N1", pattern: "～や否や", title: "As soon as / the moment that", short: "An action takes place immediately after another event.",
    explanation: "～や否や attaches to the dictionary form of a verb and means the second event follows the first almost instantaneously, with essentially no perceptible gap between them. It reads as more literary and dramatic than とたん（に）or か～ないかのうちに, and it isn't used to describe the speaker's own routine, everyday actions.\n\nBecause it emphasizes a vivid, sometimes surprising immediacy, や否や shows up most in novels, news reports, and formal retellings of events rather than casual conversation. It attaches only to verbs — never directly to adjectives or nouns.",
    usages: [
      { title: "Immediate succession", examples: [
        { japanese: "選挙戦が始まるや否や、激しい論争が巻き起こった。", furigana: "せんきょせんがはじまるやいなや、はげしいろんそうがまきおこった。", english: "As soon as the election campaign began, a fierce debate broke out." },
        { japanese: "彼女は電話を切るや否や、泣き出した。", furigana: "かのじょはでんわをきるやいなや、なきだした。", english: "The moment she hung up the phone, she burst into tears." },
        { japanese: "彼は合図を聞くや否や、走り出した。", furigana: "かれはあいずをきくやいなや、はしりだした。", english: "The moment he heard the signal, he took off running." }
      ]}
    ]
  },
  {
    id: "n1-nari", level: "N1", pattern: "～なり", title: "As soon as / right after", short: "A person does something unexpected right after an action.",
    explanation: "～なり attaches to the dictionary form of a verb and, like や否や, describes one action happening immediately after another. The key difference is nuance: なり often implies that the first action was interrupted or abandoned partway through, or that the second action was surprising given what came right before it.\n\nなり is also more clearly literary than や否や and appears almost exclusively describing a single, one-off event witnessed by the speaker or narrator — it isn't used for habitual or repeated occurrences.",
    usages: [
      { title: "Abrupt action", examples: [
        { japanese: "彼は部屋に入ってくるなり、怒鳴り散らした。", furigana: "かれはへやにはいってくるなり、どなりちらした。", english: "The moment he entered the room, he started shouting." },
        { japanese: "彼はその知らせを聞くなり、部屋を飛び出した。", furigana: "かれはそのしらせをきくなり、へやをとびだした。", english: "The moment he heard the news, he dashed out of the room." },
        { japanese: "彼はその知らせを聞くなり、部屋を飛び出した。", furigana: "かれはそのしらせをきくなり、へやをとびだした。", english: "The moment he heard the news, he dashed out of the room." }
      ]}
    ]
  },
  {
    id: "n1-soba-kara", level: "N1", pattern: "～そばから", title: "As soon as... (repeatedly)", short: "An action is repeatedly undone or rendered useless right after it happens.",
    explanation: "～そばから attaches to the dictionary form of a verb and describes a frustrating, repeating cycle: as soon as one instance of an action is finished, it's immediately undone or needs doing again. It differs from や否や and なり, which describe a single one-time sequence — そばから is specifically about an ongoing, often exasperating pattern.\n\nBecause of this nuance, そばから is almost always paired with a negative or undesirable outcome (things getting messy again, being forgotten again, breaking again), and rarely describes anything positive repeating.",
    usages: [
      { title: "Repetitive cycle", examples: [
        { japanese: "片付けるそばから、子供が部屋を散らかす。", furigana: "かたづけるそばから、こどもがへやをちらかす。", english: "As fast as I clean up, the child messily scatters things around." },
        { japanese: "覚えるそばから忘れてしまう。", furigana: "おぼえるそばからわすれてしまう。", english: "I forget things just as fast as I learn them." },
        { japanese: "覚えるそばから忘れてしまう。", furigana: "おぼえるそばからわすれてしまう。", english: "I forget things just as fast as I learn them." }
      ]}
    ]
  },
  {
    id: "n1-ni-katai-nai", level: "N1", pattern: "～にかたくない", title: "Not difficult to (imagine/feel)", short: "Expresses that an emotion, state, or deduction is easy to imagine.",
    explanation: "～にかたくない follows a noun (usually 想像 or 察する-type nouns) and means that something is easy to imagine or empathize with, given the circumstances described. It's a fixed, somewhat formal expression — かたくない literally means 'not hard', but the phrase as a whole only really combines naturally with a small handful of nouns related to imagining or guessing someone's feelings.",
    usages: [
      { title: "Easy to imagine", examples: [
        { japanese: "彼の失望は想像にかたくない。", furigana: "かれのしつぼうはそうぞうにかたくない。", english: "It is not difficult to imagine his disappointment." },
        { japanese: "両親の喜びは察するにかたくない。", furigana: "りょうしんのよろこびはさっするにかたくない。", english: "It's not hard to imagine how happy his parents were." },
        { japanese: "両親の喜びは察するにかたくない。", furigana: "りょうしんのよろこびはさっするにかたくない。", english: "It's not hard to imagine how happy his parents were." }
      ]}
    ]
  },
  {
    id: "n1-ni-taenai", level: "N1", pattern: "～に堪えない", title: "Cannot bear / unbearable or deeply filled with", short: "Expresses intense emotion (gratitude, regret) or unbearable conditions.",
    explanation: "～に堪えない has two related but distinct senses. Following an emotional noun like 感謝 or 感激, it means a feeling is so strong the speaker can barely contain it ('I can't thank you enough'). Following a verb like 聞く or 見る, it means the opposite — that something is so unpleasant or poor in quality that it's unbearable to experience.\n\nContext (an emotional noun vs. a sensory verb) is what tells the two meanings apart, since 堪える itself just means 'to endure' — the surrounding word decides whether enduring is impossible because the feeling is overwhelming, or because the experience is dreadful.",
    usages: [
      { title: "Deep emotional state", examples: [
        { japanese: "皆様のご支援に対し、感謝に堪えません。", furigana: "みなさまのごしえんにたいし、かんしゃにたえません。", english: "I am overwhelmed with gratitude for everyone's support." },
        { japanese: "あまりにひどい内容で、聞くに堪えない。", furigana: "あまりにひどいないようで、きくにたえない。", english: "The content was so awful it was unbearable to listen to." },
        { japanese: "あまりにひどい内容で、聞くに堪えない。", furigana: "あまりにひどいないようで、きくにたえない。", english: "The content was so awful it was unbearable to listen to." }
      ]}
    ]
  },
  {
    id: "n1-ni-taeru", level: "N1", pattern: "～に堪える", title: "Worthy of / capable of withstanding", short: "Has enough quality or value to deserve evaluation or reading/listening.",
    explanation: "～に堪える is the positive counterpart to に堪えない: it means something is good enough, or strong enough, to withstand a demanding test — critical scrutiny, heavy use, or a difficult situation. It commonly appears with nouns like 鑑賞（appreciation/viewing）, 批判（criticism）, or 使用（use）.",
    usages: [
      { title: "Worthy of value", examples: [
        { japanese: "大人の鑑賞に堪えるアニメ作品だ。", furigana: "おとなのかんしょうにたえるアニメさくひんだ。", english: "It is an anime work worthy of adult appreciation." },
        { japanese: "この機械は長時間の使用に堪える設計になっている。", furigana: "このきかいはちょうじかんのしようにたえるせっけいになっている。", english: "This machine is designed to withstand long hours of use." },
        { japanese: "この機械は長時間の使用に堪える設計になっている。", furigana: "このきかいはちょうじかんのしようにたえるせっけいになっている。", english: "This machine is designed to withstand long hours of use." }
      ]}
    ]
  },
  {
    id: "n1-wo-kagirini", level: "N1", pattern: "～を限りに", title: "As of / starting from (final deadline)", short: "Marks the absolute end of a period, practice, or capability.",
    explanation: "～を限りに marks a specific point (often 今日, 今年度, or a similar time expression) as a firm cutoff — after this point, a situation that has been ongoing will stop for good. It's common in formal announcements: a shop's last day of business, a service ending, a retirement.\n\nA separate, more idiomatic use is 声を限りに ('at the top of one's voice' / 'with all the volume one has'), where 限り refers to the full extent of one's voice rather than a point in time — both usages share the core idea of 限り marking an absolute limit.",
    usages: [
      { title: "Permanent conclusion", examples: [
        { japanese: "今年度を限りに、この事業を撤退いたします。", furigana: "こんねんどをかぎりに、このじぎょうをてったいいたします。", english: "We will withdraw from this business as of the end of this fiscal year." },
        { japanese: "彼女は声を限りに助けを求めた。", furigana: "かのじょはこえをかぎりにたすけをもとめた。", english: "She cried out for help at the top of her voice." },
        { japanese: "彼女は声を限りに助けを求めた。", furigana: "かのじょはこえをかぎりにたすけをもとめた。", english: "She cried out for help at the top of her voice." }
      ]}
    ]
  },
  {
    id: "n1-wo-pukamazu", level: "N1", pattern: "～を皮切りに（して）", title: "Starting with / beginning with", short: "An event begins a series of similar expanding developments.",
    explanation: "～を皮切りに（して） marks the first event in a chain or series, emphasizing that many more of the same kind followed afterward. It's most at home describing tours, product launches, campaigns, or a string of related incidents — 皮切り literally evokes 'the first cut', the initial move that gets a whole sequence going.",
    usages: [
      { title: "Initial spark of a chain", examples: [
        { japanese: "東京公演を皮切りに、全国ツアーが始まる。", furigana: "とうきょうこうえんをかわきりに、ぜんこくツアーがはじまる。", english: "Starting with the Tokyo performance, the nationwide tour will begin." },
        { japanese: "この事件を皮切りに、次々と不正が発覚した。", furigana: "このじけんをかわきりに、つぎつぎとふせいがはっかくした。", english: "Starting with this incident, one instance of fraud after another came to light." },
        { japanese: "この事件を皮切りに、次々と不正が発覚した。", furigana: "このじけんをかわきりに、つぎつぎとふせいがはっかくした。", english: "Starting with this incident, one instance of fraud after another came to light." }
      ]}
    ]
  },
  {
    id: "n1-wo-furu-koto-naku", level: "N1", pattern: "～余儀なくされる / ～余儀なくさせる", title: "Forced to / compelled to", short: "Circumstances force an unwanted action or change of plan.",
    explanation: "～余儀なくされる means someone is forced into a course of action by circumstances entirely outside their control — the nuance is specifically that there was no acceptable alternative. Its counterpart, ～余儀なくさせる, flips the perspective: something (usually a situation or event, not a person) forces someone else into that position.\n\nBoth are formal, written-register expressions common in news reports (companies forced into restructuring, residents forced to evacuate) rather than everyday speech.",
    usages: [
      { title: "Forced change", examples: [
        { japanese: "悪天候のため、計画の変更を余儀なくされた。", furigana: "あくてんこうのため、けいかくのへんこうをよぎなくされた。", english: "Due to bad weather, we were forced to change our plans." },
        { japanese: "会社は経営難のため、大規模なリストラを余儀なくされた。", furigana: "かいしゃはけいえいなんのため、だいきぼなリストラをよぎなくされた。", english: "Due to financial difficulties, the company was forced into large-scale restructuring." },
        { japanese: "会社は経営難のため、大規模なリストラを余儀なくされた。", furigana: "かいしゃはけいえいなんのため、だいきぼなリストラをよぎなくされた。", english: "Due to financial difficulties, the company was forced into large-scale restructuring." }
      ]}
    ]
  },
  {
    id: "n1-tomo-naku", level: "N1", pattern: "～ともなく / ～ともなしに", title: "Unintentionally / without thinking", short: "Doing a passive sensory action without a clear purpose.",
    explanation: "～ともなく (and the fuller ～ともなしに) describes an action done without clear intention or focus — looking somewhere without really watching, wondering something without deliberately thinking about it, or a sound or smell arriving from an unidentifiable direction. It often pairs with question words like どこ, だれ, or なに, producing set phrases like どこからともなく ('from who-knows-where').",
    usages: [
      { title: "Aimless sensory action", examples: [
        { japanese: "テレビを見るともなく眺めていた。", furigana: "テレビをみるともなくながめていた。", english: "I was idly gazing at the television without really watching it." },
        { japanese: "どこからともなく、いい匂いが漂ってきた。", furigana: "どこからともなく、いいにおいがただよってきた。", english: "A nice smell drifted in from who-knows-where." },
        { japanese: "どこからともなく、いい匂いが漂ってきた。", furigana: "どこからともなく、いいにおいがただよってきた。", english: "A nice smell drifted in from who-knows-where." }
      ]}
    ]
  },
  {
    id: "n1-ni-matsuaru", level: "N1", pattern: "～にまつわる", title: "Related to / associated with", short: "Pertaining to a specific story, history, or tradition.",
    explanation: "～にまつわる follows a noun and modifies another noun that follows it, meaning 'related to' or 'associated with' — often used for stories, legends, rumors, or historical background tied to a place, person, or object.",
    usages: [
      { title: "Associated narrative", examples: [
        { japanese: "この城には恐ろしい伝説にまつわる話がある。", furigana: "このしろにはおそろしいでんせつにまつわるはなしがある。", english: "This castle has stories associated with a terrifying legend." },
        { japanese: "この地名にまつわる由来を調べた。", furigana: "このちめいにまつわるゆらいをしらべた。", english: "I looked into the origin story associated with this place name." },
        { japanese: "この地名にまつわる由来を調べた。", furigana: "このちめいにまつわるゆらいをしらべた。", english: "I looked into the origin story associated with this place name." }
      ]}
    ]
  },
  {
    id: "n1-wo-puke-te", level: "N1", pattern: "～をおいて～ない", title: "There is no other than / none except", short: "Emphasizes that a specific person or thing is uniquely suited.",
    explanation: "～をおいて～ない is an emphatic construction meaning 'there is no one/nothing except X' — X is singled out as the one and only option. It most often praises a specific person's unique qualification for a role, but can apply to things as well. The を marks the one exception, and the ない at the end negates every other possibility.",
    usages: [
      { title: "Unique suitabilities", examples: [
        { japanese: "この大役を果たせるのは、彼をおいて他にはいない。", furigana: "このたいやくをはたせるのは、かれをおいてほかにはいない。", english: "There is no one other than him who can fulfill this major role." },
        { japanese: "この町の魅力を語れるのは、彼女をおいて他にいない。", furigana: "このまちのみりょくをかたれるのは、かのじょをおいてほかにいない。", english: "There's no one but her who can speak to this town's charm." },
        { japanese: "この町の魅力を語れるのは、彼女をおいて他にいない。", furigana: "このまちのみりょくをかたれるのは、かのじょをおいてほかにいない。", english: "There's no one but her who can speak to this town's charm." }
      ]}
    ]
  },
  {
    id: "n1-wo-akashi-ni", level: "N1", pattern: "～を押して / ～を押してでも", title: "In spite of / despite (pushing through difficulties)", short: "Overcoming opposing forces, bad health, or risks to act.",
    explanation: "～を押して means doing something despite an obstacle that would normally stop most people — illness, opposition, bad weather — with a nuance of determined, almost forceful persistence. Adding でも (～を押してでも) intensifies this further, implying the speaker will push through no matter the cost.",
    usages: [
      { title: "Overcoming obstacles", examples: [
        { japanese: "周囲の反対を押して、彼は夢を追求した。", furigana: "しゅういのはんたいをおして、かれはゆめをついきゅうした。", english: "In spite of opposition from those around him, he pursued his dream." },
        { japanese: "彼女は病気を押して、舞台に立った。", furigana: "かのじょはびょうきをおして、ぶたいにたった。", english: "She took to the stage, pushing through her illness." },
        { japanese: "彼女は病気を押して、舞台に立った。", furigana: "かのじょはびょうきをおして、ぶたいにたった。", english: "She took to the stage, pushing through her illness." }
      ]}
    ]
  },
  {
    id: "n1-ni-tariru", level: "N1", pattern: "～にたる / ～にたりない", title: "Worthy of / sufficient to", short: "Sufficient in quality or value to warrant a certain treatment.",
    explanation: "～にたる follows a noun or verb and means someone or something has sufficient merit to deserve trust, respect, or serious consideration — 'worthy of X'. The negative, ～にたりない, dismisses something as not even worth that level of consideration, often with a slightly dismissive or critical tone.",
    usages: [
      { title: "Worthy of trust/evaluation", examples: [
        { japanese: "彼は信頼するにたる人物だ。", furigana: "かれはしんらいするにたるじんぶつだ。", english: "He is a person worthy of trust." },
        { japanese: "この計画は検討するにたりない、粗末なものだ。", furigana: "このけいかくはけんとうするにたりない、そまつなものだ。", english: "This plan is too shoddy to even be worth considering." },
        { japanese: "この計画は検討するにたりない、粗末なものだ。", furigana: "このけいかくはけんとうするにたりない、そまつなものだ。", english: "This plan is too shoddy to even be worth considering." }
      ]}
    ]
  },
  {
    id: "n1-ga-ti-i-re", level: "N1", pattern: "～が早いか", title: "No sooner had... than...", short: "Immediate reaction as soon as a prerequisite action finishes.",
    explanation: "～が早いか describes two actions happening in such close succession that the second seems to start before the first has even finished — a slightly more literary, narrative-focused cousin of や否や, often used to convey a sense of swift, almost reflexive action.",
    usages: [
      { title: "Instantaneous action", examples: [
        { japanese: "チャイムが鳴るが早いか、生徒たちは教室を飛び出した。", furigana: "チャイムがなるがはやいか、せいとたちはきょうしつをとびだした。", english: "No sooner had the chime rung than the students rushed out of the classroom." },
        { japanese: "彼は席に着くが早いか、資料を読み始めた。", furigana: "かれはせきにつくがはやいか、しりょうをよみはじめた。", english: "No sooner had he sat down than he began reading the documents." },
        { japanese: "彼は席に着くが早いか、資料を読み始めた。", furigana: "かれはせきにつくがはやいか、しりょうをよみはじめた。", english: "No sooner had he sat down than he began reading the documents." }
      ]}
    ]
  },
  {
    id: "n1-mamire", level: "N1", pattern: "～まみれ", title: "Covered in / smeared with", short: "A surface is unpleasantly covered in a liquid, powder, or substance.",
    explanation: "～まみれ attaches to a noun describing something messy, unpleasant, or undesirable that covers a person or thing entirely — mud, sweat, blood, dust. It can also extend metaphorically to abstract burdens someone is 'covered in' or overwhelmed by, like debt or mistakes.",
    usages: [
      { title: "Smeared or burdened", examples: [
        { japanese: "選手たちは泥まみれになりながらボールを追った。", furigana: "せんしゅたちはどろまみれになりながらボールをおった。", english: "The players chased the ball while completely covered in mud." },
        { japanese: "借金まみれの生活から抜け出したい。", furigana: "しゃっきんまみれのせいかつからぬけだしたい。", english: "I want to escape a life buried in debt." },
        { japanese: "借金まみれの生活から抜け出したい。", furigana: "しゃっきんまみれのせいかつからぬけだしたい。", english: "I want to escape a life buried in debt." }
      ]}
    ]
  },
  {
    id: "n1-wo-yoshito-shinai", level: "N1", pattern: "～をもって", title: "By means of / as of (formal limit)", short: "Formal marker for means, cause, or precise point of termination.",
    explanation: "～をもって is a formal way to mark a means, method, or a precise cutoff point — 'by means of X' or 'as of X'. In announcements, it often closes out an event or period (本日をもって終了, 'concluding as of today'); attached to a personal quality, it can also mean 'by virtue of X' or 'given X'.",
    usages: [
      { title: "Official termination", examples: [
        { japanese: "本日の営業はこれをもって終了いたします。", furigana: "ほんじつのえいぎょうはこれをもってしゅうりょういたします。", english: "Business for today hereby concludes as of this moment." },
        { japanese: "彼の実力をもってすれば、優勝は間違いない。", furigana: "かれのじつりょくをもってすれば、ゆうしょうはまちがいない。", english: "Given his skill, victory is certain." },
        { japanese: "彼の実力をもってすれば、優勝は間違いない。", furigana: "かれのじつりょくをもってすれば、ゆうしょうはまちがいない。", english: "Given his skill, victory is certain." }
      ]}
    ]
  },
  {
    id: "n1-bare-ba", level: "N1", pattern: "～ばこそ", title: "Precisely because", short: "Emphasizes that a specific reason is the exact driver behind an action.",
    explanation: "～ばこそ attaches to the ば-form of a verb or adjective and emphasizes that a specific reason — and only that reason — explains an action or feeling, often one that might otherwise look harsh or counterintuitive from the outside (strict discipline that comes from love, for example). It's stronger and more literary than からこそ.",
    usages: [
      { title: "Emphatic reason", examples: [
        { japanese: "子供を思えばこそ、厳しく育てるのです。", furigana: "こどもをおもえばこそ、きびしくそだてるのです。", english: "It is precisely because I care for my child that I raise them strictly." },
        { japanese: "あなたを信じればこそ、この仕事を任せたのです。", furigana: "あなたをしんじればこそ、このしごとをまかせたのです。", english: "It's precisely because I trust you that I entrusted this work to you." },
        { japanese: "あなたを信じればこそ、この仕事を任せたのです。", furigana: "あなたをしんじればこそ、このしごとをまかせたのです。", english: "It's precisely because I trust you that I entrusted this work to you." }
      ]}
    ]
  },
  {
    id: "n1-tottari-ni", level: "N1", pattern: "～と相まって", title: "Combined with / in synergy with", short: "Two factors combine to produce a heightened or distinct outcome.",
    explanation: "～と相まって describes two separate factors combining to produce an effect that's stronger than either would create alone — a kind of synergy. It's common in descriptions of scenery, atmosphere, or economic effects where multiple contributing elements are being credited together.",
    usages: [
      { title: "Synergistic effect", examples: [
        { japanese: "美しい紅葉と相まって、湖の風景は絶景だった。", furigana: "うつくしいこうようとあいまって、みずうみのふうけいはぜっけいだった。", english: "Combined with the beautiful autumn leaves, the scenery of the lake was breathtaking." },
        { japanese: "円安と相まって、輸出が大きく伸びた。", furigana: "えんやすとあいまって、ゆしゅつがおおきくのびた。", english: "Combined with the weak yen, exports grew significantly." },
        { japanese: "円安と相まって、輸出が大きく伸びた。", furigana: "えんやすとあいまって、ゆしゅつがおおきくのびた。", english: "Combined with the weak yen, exports grew significantly." }
      ]}
    ]
  },
  {
    id: "n1-koto-naku", level: "N1", pattern: "～ことなしに", title: "Without doing X even once", short: "A outcome is achieved without undergoing an expected step.",
    explanation: "～ことなしに is a formal, literary equivalent of ～ないで／～せずに, meaning 'without ever doing X'. It often appears with verbs like 諦める (give up) or 迷う (hesitate) to praise someone's unwavering resolve.",
    usages: [
      { title: "Omitted step", examples: [
        { japanese: "努力することなしに、成功は掴めない。", furigana: "どりょくすることなしに、せいこうはつかめない。", english: "You cannot grasp success without making an effort." },
        { japanese: "彼はためらうことなしに、危険な現場へ向かった。", furigana: "かれはためらうことなしに、きけんなげんばへむかった。", english: "He headed to the dangerous scene without hesitating even once." },
        { japanese: "彼はためらうことなしに、危険な現場へ向かった。", furigana: "かれはためらうことなしに、きけんなげんばへむかった。", english: "He headed to the dangerous scene without hesitating even once." }
      ]}
    ]
  },
  {
    id: "n1-ikan", level: "N1", pattern: "～いかんでは / ～いかんだ / ～いかんによらず", title: "Depends on / depending on", short: "Formal expressions of dependence on, or indifference to, a factor.",
    explanation: "いかん is a formal noun meaning roughly 'the state of affairs' or 'how something turns out'. ～いかんでは means an outcome depends on how a particular factor plays out; ～いかんだ states plainly that everything hinges on that one factor; and ～いかんによらず（or にかかわらず）flips it to mean the outcome is the same no matter how that factor turns out.\n\nAll three are formal, written-register expressions — common in official notices, business writing, and news reporting rather than casual speech.",
    usages: [
      { title: "Depends on (いかんだ)", examples: [
        { japanese: "結果はやり方いかんだ。", furigana: "けっかはやりかたいかんだ。", english: "The result depends entirely on how you do it." }
      ]},
      { title: "Possibly, depending on (いかんでは)", examples: [
        { japanese: "状況いかんでは、中止するかもしれない。", furigana: "じょうきょういかんでは、ちゅうしするかもしれない。", english: "Depending on the situation, we may have to cancel." }
      ]},
      { title: "Regardless of (いかんによらず)", examples: [
        { japanese: "理由のいかんによらず、遅刻は認められない。", furigana: "りゆうのいかんによらず、ちこくはみとめられない。", english: "Regardless of the reason, lateness is not accepted." }
      ]},
      { title: "いかんによらず — regardless of how it turns out", examples: [
        { japanese: "理由のいかんによらず、遅刻は遅刻だ。", furigana: "りゆうのいかんによらず、ちこくはちこくだ。", english: "Regardless of the reason, being late is being late." }
      ]}
    ]
  },
  {
    id: "n1-ari-te", level: "N1", pattern: "～あっての", title: "Exists only because of", short: "X is what makes Y possible in the first place.",
    explanation: "～あっての emphasizes that something can only exist or make sense because of a prior, essential condition — remove that condition, and the rest collapses. It's often used to humbly acknowledge who or what one owes their position to (customers, supporters, health).",
    usages: [
      { title: "Foundational relationship", examples: [
        { japanese: "お客様あっての商売です。", furigana: "おきゃくさまあってのしょうばいです。", english: "Business exists only because of its customers." },
        { japanese: "健康あっての人生だ。", furigana: "けんこうあってのじんせいだ。", english: "Life is only possible when you have your health." },
        { japanese: "健康あっての人生だ。", furigana: "けんこうあってのじんせいだ。", english: "Life is only possible when you have your health." }
      ]}
    ]
  },
  {
    id: "n1-are-koso", level: "N1", pattern: "～あればこそ", title: "Only because / precisely because", short: "Emphasizes that a specific condition is the true reason for a result.",
    explanation: "～あればこそ is closely related to ～ばこそ, but attaches specifically after ある (or an implied ある) to emphasize that a particular condition being present is precisely what made a good outcome possible — 'it's only because there was X that Y happened'.",
    usages: [
      { title: "Justified reason", examples: [
        { japanese: "苦労あればこそ、人は成長する。", furigana: "くろうあればこそ、ひとはせいちょうする。", english: "It is precisely through hardship that people grow." },
        { japanese: "皆様の協力あればこそ、このイベントは成功しました。", furigana: "みなさまのきょうりょくあればこそ、このイベントはせいこうしました。", english: "It's precisely thanks to everyone's cooperation that this event succeeded." },
        { japanese: "皆様の協力あればこそ、このイベントは成功しました。", furigana: "みなさまのきょうりょくあればこそ、このイベントはせいこうしました。", english: "It's precisely thanks to everyone's cooperation that this event succeeded." }
      ]}
    ], notes: "Compare N1 ～ばこそ: あればこそ follows nouns, while ～ばこそ follows verb conditionals."
  },
  {
    id: "n1-katawara", level: "N1", pattern: "～かたわら（に）", title: "On the side / while also", short: "Doing a secondary activity alongside a main occupation.",
    explanation: "～かたわら（に）describes someone maintaining a second, ongoing activity alongside their main occupation — studying while working, writing novels alongside a day job. It implies both activities are sustained over a meaningful period, not a one-off simultaneous action (which would instead use ながら).",
    usages: [
      { title: "Side activity", examples: [
        { japanese: "本業のかたわら、絵を描いている。", furigana: "ほんぎょうのかたわら、えをかいている。", english: "Alongside my main job, I paint." },
        { japanese: "彼女は仕事のかたわら、大学院で学んでいる。", furigana: "かのじょはしごとのかたわら、だいがくいんでまなんでいる。", english: "Alongside her job, she's studying at graduate school." },
        { japanese: "彼女は仕事のかたわら、大学院で学んでいる。", furigana: "かのじょはしごとのかたわら、だいがくいんでまなんでいる。", english: "Alongside her job, she's studying at graduate school." }
      ]}
    ]
  },
  {
    id: "n1-katagata", level: "N1", pattern: "～かたがた", title: "While doing (formal)", short: "Combining a formal action with a secondary purpose.",
    explanation: "～かたがた is a formal expression meaning 'while also' or 'combined with the purpose of', used to note that a single visit or action serves two polite purposes at once — commonly seen in formal letters and greetings (お礼かたがた, 'to thank you and also...').",
    usages: [
      { title: "Formal combined purpose", examples: [
        { japanese: "ご挨拶かたがた、お願いに参りました。", furigana: "ごあいさつかたがた、おねがいにまいりました。", english: "I have come both to greet you and to make a request." },
        { japanese: "お礼かたがた、近況をご報告いたします。", furigana: "おれいかたがた、きんきょうをごほうこくいたします。", english: "I'm writing to thank you, and to also share a brief update." },
        { japanese: "お礼かたがた、近況をご報告いたします。", furigana: "おれいかたがた、きんきょうをごほうこくいたします。", english: "I'm writing to thank you, and to also share a brief update." }
      ]}
    ]
  },
  {
    id: "n1-ga-yue-ni", level: "N1", pattern: "～がゆえに / ～がゆえの", title: "Because of / due to (formal)", short: "A quality or circumstance inevitably produces a consequence.",
    explanation: "～がゆえに is a formal, literary way to state a reason, often for something that sounds paradoxical or bittersweet — a virtue causing a problem, or youth explaining a mistake. It carries more weight and formality than から or ので, and 若さがゆえの過ち ('a mistake born of youth') is a classic example of its flavor.",
    usages: [
      { title: "Inherent consequence", examples: [
        { japanese: "若さがゆえの失敗だ。", furigana: "わかさがゆえのしっぱいだ。", english: "It is a failure born of youth." },
        { japanese: "完璧主義であるがゆえに、彼は仕事を抱え込みすぎる。", furigana: "かんぺきしゅぎであるがゆえに、かれはしごとをかかえこみすぎる。", english: "Because he's a perfectionist, he takes on too much work." },
        { japanese: "完璧主義であるがゆえに、彼は仕事を抱え込みすぎる。", furigana: "かんぺきしゅぎであるがゆえに、かれはしごとをかかえこみすぎる。", english: "Because he's a perfectionist, he takes on too much work." }
      ]}
    ], notes: "～ゆえに is the standalone variant; ～がゆえに connects directly to the noun."
  },
  {
    id: "n1-bekarazu", level: "N1", pattern: "～べからず", title: "Must not (prohibition, formal)", short: "A formal written prohibition, seen on signs and rules.",
    explanation: "～べからず is a classical, formal prohibition — the archaic negative of べし ('should') — mostly surviving today in posted signs, rules, and set proverbial phrases. It sounds stern and impersonal, which is exactly why it's chosen for official notices rather than casual requests.",
    usages: [
      { title: "Written prohibition", examples: [
        { japanese: "関係者以外立ち入るべからず。", furigana: "かんけいしゃいがいたちいるべからず。", english: "No entry except for authorized personnel." },
        { japanese: "初心忘るべからず。", furigana: "しょしんわするべからず。", english: "Never forget your beginner's spirit. (proverb)" },
        { japanese: "初心忘るべからず。", furigana: "しょしんわするべからず。", english: "Never forget your beginner's spirit. (proverb)" }
      ]}
    ]
  },
  {
    id: "n1-shidai", level: "N1", pattern: "～次第だ / ～次第で / ～次第による", title: "Depends on / as soon as", short: "Rests everything on one factor, or links two events with no delay.",
    explanation: "次第 as a noun means roughly 'depending on' or 'as soon as'. ～次第だ can close a sentence to say an outcome depends entirely on a preceding factor; ～次第で is the adverbial form used mid-sentence ('depending on X, ...'); and attached directly to a verb stem (連絡し次第), 次第 instead means 'as soon as' — a distinct, unrelated use worth keeping separate in your mind from the 'depends on' meaning.",
    usages: [
      { title: "Everything depends on", examples: [
        { japanese: "成功するかどうかは努力次第だ。", furigana: "せいこうするかどうかはどりょくしだいだ。", english: "Whether we succeed depends entirely on effort." }
      ]},
      { title: "Depending on (次第で)", examples: [
        { japanese: "使い方次第で、結果は変わる。", furigana: "つかいかたしだいで、けっかはかわる。", english: "The result changes depending on how you use it." }
      ]},
      { title: "As soon as", examples: [
        { japanese: "到着次第、ご連絡いたします。", furigana: "とうちゃくしだい、ごれんらくいたします。", english: "I will contact you as soon as I arrive." }
      ]},
      { title: "Verb stem + 次第 — as soon as", examples: [
        { japanese: "空港に着き次第、電話します。", furigana: "くうこうにつきしだい、でんわします。", english: "I'll call you as soon as I arrive at the airport." }
      ]}
    ]
  },
  {
    id: "n1-ja-arumai-shi", level: "N1", pattern: "～じゃあるまいし / ～でもあるまいし", title: "It's not like / we're not...", short: "Dismisses an excuse or unreasonable assumption about identity or status.",
    explanation: "～じゃあるまいし (or ～でもあるまいし) points out, often with some exasperation or sarcasm, that the listener is acting as though some unlikely or absurd premise were true — 'it's not like you're X, so...'. It's a distinctly spoken, somewhat blunt expression, best used with people you know well.",
    usages: [
      { title: "Dismissing an excuse", examples: [
        { japanese: "子供じゃあるまいし、自分で決めなさい。", furigana: "こどもじゃあるまいし、じぶんできめなさい。", english: "You're not a child — decide for yourself." },
        { japanese: "神様じゃあるまいし、全部予測できるわけがない。", furigana: "かみさまじゃあるまいし、ぜんぶよそくできるわけがない。", english: "I'm no god — there's no way I could predict everything." },
        { japanese: "神様じゃあるまいし、全部予測できるわけがない。", furigana: "かみさまじゃあるまいし、ぜんぶよそくできるわけがない。", english: "I'm no god — there's no way I could predict everything." }
      ]}
    ]
  },
  {
    id: "n1-taritomo", level: "N1", pattern: "～たりとも", title: "Even one / not even a single", short: "Emphasizes that not even the smallest unit is allowed or possible.",
    explanation: "～たりとも follows a minimal quantity (一日, 一瞬, 一円) and, paired with a negative, emphatically denies even that smallest amount — 'not even a single X'. It's a formal intensifier, giving the negation far more force than a plain ～も～ない construction would.",
    usages: [
      { title: "Absolute minimum denied", examples: [
        { japanese: "一日たりとも無駄にはできない。", furigana: "ついたちたりともむだにはできない。", english: "I cannot waste even a single day." },
        { japanese: "一瞬たりとも気を抜けない状況だった。", furigana: "いっしゅんたりともきをぬけないじょうきょうだった。", english: "It was a situation where I couldn't let my guard down for even a moment." },
        { japanese: "一瞬たりとも気を抜けない状況だった。", furigana: "いっしゅんたりともきをぬけないじょうきょうだった。", english: "It was a situation where I couldn't let my guard down for even a moment." }
      ]}
    ]
  },
  {
    id: "n1-dani", level: "N1", pattern: "～だに", title: "Even (without doing / barely)", short: "Even the slightest hint of something was absent or unbearable.",
    explanation: "～だに is a formal, literary intensifier attaching to a noun or the dictionary form of a verb, meaning 'even' in the sense of 'merely doing/thinking this much is enough to...'. It commonly pairs with verbs like 想像する or 聞く to say that even the lightest brush with an idea produces a strong reaction.",
    usages: [
      { title: "Not even in imagination", examples: [
        { japanese: "こんな結果は想像だにしなかった。", furigana: "こんなけっかはそうぞうだにしなかった。", english: "I never even imagined such an outcome." },
        { japanese: "その名を聞くだに、恐ろしくなる。", furigana: "そのなをきくだに、おそろしくなる。", english: "Just hearing that name is enough to frighten me." },
        { japanese: "その名を聞くだに、恐ろしくなる。", furigana: "そのなをきくだに、おそろしくなる。", english: "Just hearing that name is enough to frighten me." }
      ]}
    ]
  },
  {
    id: "n1-to-aru", level: "N1", pattern: "～とある", title: "A certain", short: "Refers to something specific without naming it.",
    explanation: "とある is a fixed, storytelling expression meaning 'a certain' — used to introduce a place, time, or person without specifying details, much like 'once upon a time, in a certain town...' in English. It has a slightly literary, scene-setting feel and isn't used to talk about specific, known things.",
    usages: [
      { title: "Unnamed specific", examples: [
        { japanese: "とある田舎で知り合いました。", furigana: "とあるいなかでしりあいました。", english: "We met in a certain rural town." },
        { japanese: "とある喫茶店で偶然彼女に会った。", furigana: "とあるきっさてんでぐうぜんかのじょにあった。", english: "I happened to run into her at a certain café." },
        { japanese: "とある喫茶店で偶然彼女に会った。", furigana: "とあるきっさてんでぐうぜんかのじょにあった。", english: "I happened to run into her at a certain café." }
      ]}
    ]
  },
  {
    id: "n1-to-kaku", level: "N1", pattern: "～とかく", title: "Tend to / somehow / in one way or another", short: "A generalization about how a type of person or thing tends to behave.",
    explanation: "とかく is an adverb meaning 'tend to' or 'somehow, one way or another' — used to comment on a general tendency people or things have, often with a slightly critical or resigned tone about how the world just seems to work that way.",
    usages: [
      { title: "Tendency of a group", examples: [
        { japanese: "人はとかく、都合のいいことを信じたがる。", furigana: "ひとはとかく、つごうのいいことをしんじたがる。", english: "People tend to believe what is convenient for them." },
        { japanese: "とかく噂とは尾ひれがつくものだ。", furigana: "とかくうわさとはおひれがつくものだ。", english: "Rumors have a way of getting exaggerated, one way or another." },
        { japanese: "とかく噂とは尾ひれがつくものだ。", furigana: "とかくうわさとはおひれがつくものだ。", english: "Rumors have a way of getting exaggerated, one way or another." }
      ]}
    ]
  },
  {
    id: "n1-tokoro-wo", level: "N1", pattern: "～ところを", title: "Even though / at the very moment", short: "Interrupting someone at a busy or inconvenient moment, or despite circumstances.",
    explanation: "～ところを marks a specific moment or situation — often an inconvenient, busy, or vulnerable one — as the backdrop against which something else happens. It commonly appears in polite apologies for interrupting someone (お忙しいところを) or in expressions of gratitude for help received at a difficult moment.",
    usages: [
      { title: "Interrupting apology", examples: [
        { japanese: "お忙しいところを、失礼いたします。", furigana: "おいそがしいところを、しつれいいたします。", english: "Forgive me for disturbing you when you are busy." },
        { japanese: "危ないところを助けていただき、ありがとうございました。", furigana: "あぶないところをたすけていただき、ありがとうございました。", english: "Thank you for helping me at that dangerous moment." },
        { japanese: "危ないところを助けていただき、ありがとうございました。", furigana: "あぶないところをたすけていただき、ありがとうございました。", english: "Thank you for helping me at that dangerous moment." }
      ]}
    ]
  },
  {
    id: "n1-dzukume", level: "N1", pattern: "～づくめ", title: "All over / nothing but", short: "Covered entirely in one color, or consisting only of one kind of thing.",
    explanation: "～づくめ attaches to a noun to describe something entirely made up of, or completely covered in, that one thing — 黒ずくめ ('dressed all in black'), いいことずくめ ('nothing but good news'). It emphasizes totality: there's no exception or variation within the described state.",
    usages: [
      { title: "All one color", examples: [
        { japanese: "黒づくめの服を着ていた。", furigana: "くろづくめのふくをきていた。", english: "She was dressed all in black." },
        { japanese: "今年はいいことずくめの一年だった。", furigana: "ことしはいいことずくめのいちねんだった。", english: "This year was one good thing after another." }
      ]},
      { title: "Only one kind of thing", examples: [
        { japanese: "このごろは忙しいことづくめだ。", furigana: "このごろはいそがしいことづくめだ。", english: "These days it's nothing but busy-ness." }
      ]}
    ]
  },
  {
    id: "n1-hishite", level: "N1", pattern: "ひいては", title: "And consequently / by extension", short: "Extends a consequence from the immediate to the broader level.",
    explanation: "ひいては introduces a broader, secondary consequence that follows from a more immediate one already mentioned — 'and, by extension, ...'. It's common in writing about how a small, local effort or change contributes to something larger (a community's growth, a country's development).",
    usages: [
      { title: "Extended consequence", examples: [
        { japanese: "地域の発展を促し、ひいては国全体に貢献する。", furigana: "ちいきのはってんをうながし、ひいてはくにぜんたいにこうけんする。", english: "It promotes regional development and, by extension, contributes to the whole country." },
        { japanese: "個人の成長は、ひいてはチーム全体の力になる。", furigana: "こじんのせいちょうは、ひいてはチームぜんたいのちからになる。", english: "Individual growth, by extension, becomes strength for the whole team." },
        { japanese: "個人の成長は、ひいてはチーム全体の力になる。", furigana: "こじんのせいちょうは、ひいてはチームぜんたいのちからになる。", english: "Individual growth, by extension, becomes strength for the whole team." }
      ]}
    ]
  },
  {
    id: "n1-beku", level: "N1", pattern: "～べく", title: "In order to (formal)", short: "A formal purpose expression attaching to dictionary-form verbs.",
    explanation: "～べく is a formal, literary way to express purpose — 'in order to' — attaching to the dictionary form of a verb. It's essentially a more formal register of ように or ために, favored in written Japanese, speeches, and business contexts over everyday conversation.",
    usages: [
      { title: "Formal purpose", examples: [
        { japanese: "合格すべく、日夜勉強した。", furigana: "ごうかくすべく、にちやべんきょうした。", english: "In order to pass, I studied day and night." },
        { japanese: "資金を集めるべく、様々な方法を試した。", furigana: "しきんをあつめるべく、さまざまなほうほうをためした。", english: "In order to raise funds, we tried various methods." },
        { japanese: "資金を集めるべく、様々な方法を試した。", furigana: "しきんをあつめるべく、さまざまなほうほうをためした。", english: "In order to raise funds, we tried various methods." }
      ]}
    ]
  },
  {
    id: "n1-beku-mo-nai", level: "N1", pattern: "～べくもない", title: "Cannot possibly", short: "Something is beyond the speaker's ability or possibility.",
    explanation: "～べくもない attaches to a verb and formally states that something is entirely out of the question or impossible to achieve, often because of an obvious gap in ability, resources, or circumstance. It's a firm, somewhat literary way of saying 'there's no way X could happen'.",
    usages: [
      { title: "Beyond possibility", examples: [
        { japanese: "そんな高い山は登るべくもない。", furigana: "そんなたかいやまはのぼるべくもない。", english: "There is no way I could climb such a high mountain." },
        { japanese: "素人の私に、専門家の技術は真似るべくもない。", furigana: "しろうとのわたしに、せんもんかのぎじゅつはまねるべくもない。", english: "As an amateur, there's no way I could imitate an expert's skill." },
        { japanese: "素人の私に、専門家の技術は真似るべくもない。", furigana: "しろうとのわたしに、せんもんかのぎじゅつはまねるべくもない。", english: "As an amateur, there's no way I could imitate an expert's skill." }
      ]}
    ]
  },
  {
    id: "n1-made-da", level: "N1", pattern: "～までだ / ～までのことだ", title: "That's all / merely", short: "Resigned acceptance that the only remaining option is X.",
    explanation: "～までだ (also ～までのことだ) attaches to the dictionary form of a verb to declare a simple, resolved fallback plan — 'if this doesn't work, I'll just do that instead', with a calm, unbothered tone rather than desperation. It's often used to downplay a setback by showing there's an easy, acceptable alternative.",
    usages: [
      { title: "Resigned last resort", examples: [
        { japanese: "ダメなら、また挑戦するまでだ。", furigana: "ダメなら、またちょうせんするまでだ。", english: "If it fails, I'll simply try again." },
        { japanese: "誰も手伝ってくれないなら、一人でやるまでだ。", furigana: "だれもてつだってくれないなら、ひとりでやるまでだ。", english: "If no one will help, I'll simply do it alone." },
        { japanese: "誰も手伝ってくれないなら、一人でやるまでだ。", furigana: "だれもてつだってくれないなら、ひとりでやるまでだ。", english: "If no one will help, I'll simply do it alone." }
      ]}
    ]
  },
  {
    id: "n1-sarukoto", level: "N1", pattern: "～もさることながら", title: "Admittedly... but more importantly", short: "Concedes a quality while highlighting an even more important one.",
    explanation: "～もさることながら concedes that the first thing mentioned is certainly impressive or noteworthy, but then goes on to highlight something else that's just as important, or even more so. It's a graceful way to praise two things without seeming to dismiss either one.",
    usages: [
      { title: "Layered praise", examples: [
        { japanese: "彼の才能もさることながら、その努力が認められる。", furigana: "かれのさいのうもさることながら、そのどりょくがみとめられる。", english: "His talent is undeniable, but his effort deserves even more recognition." },
        { japanese: "味もさることながら、店の雰囲気も素晴らしい。", furigana: "あじもさることながら、みせのふんいきもすばらしい。", english: "The taste is wonderful, but the shop's atmosphere is just as impressive." },
        { japanese: "味もさることながら、店の雰囲気も素晴らしい。", furigana: "あじもさることながら、みせのふんいきもすばらしい。", english: "The taste is wonderful, but the shop's atmosphere is just as impressive." }
      ]}
    ]
  },
  {
    id: "n1-wo-yosoni", level: "N1", pattern: "～をよそに", title: "In spite of / disregarding", short: "Someone acts freely while ignoring the feelings or situation of others.",
    explanation: "～をよそに follows a noun (often others' concern, worry, or opposition) and describes someone proceeding with an action while completely ignoring or disregarding it — usually with a critical undertone, suggesting the person's disregard is careless or selfish.",
    usages: [
      { title: "Disregarding others", examples: [
        { japanese: "親の心配をよそに、息子は遊んでばかりいる。", furigana: "おやのしんぱいをよそに、むすこはあそんでばかりいる。", english: "Ignoring his parents' worries, the son does nothing but play." },
        { japanese: "周囲の反対をよそに、彼は計画を進めた。", furigana: "しゅういのはんたいをよそに、かれはけいかくをすすめた。", english: "Disregarding opposition from those around him, he went ahead with the plan." },
        { japanese: "周囲の反対をよそに、彼は計画を進めた。", furigana: "しゅういのはんたいをよそに、かれはけいかくをすすめた。", english: "Disregarding opposition from those around him, he went ahead with the plan." }
      ]}
    ]
  },
  {
    id: "n1-wo-mono-tomo-sezu", level: "N1", pattern: "～をものともせず（に）", title: "Undaunted by / braving", short: "Pushing forward without being deterred by obstacles or dangers.",
    explanation: "～をものともせず（に）follows a noun describing a difficulty or obstacle and means facing it head-on without being intimidated by it — unlike をよそに, this phrase carries an admiring, not critical, tone. It praises courage and resilience rather than criticizing disregard.",
    usages: [
      { title: "Unshaken resolve", examples: [
        { japanese: "困難をものともせずに前進する。", furigana: "こんなんをものともせずにぜんしんする。", english: "They push forward, undaunted by difficulties." },
        { japanese: "彼女は周囲の批判をものともせず、自分の道を歩み続けた。", furigana: "かのじょはしゅういのひはんをものともせず、じぶんのみちをあゆみつづけた。", english: "Undaunted by criticism from those around her, she continued down her own path." },
        { japanese: "彼女は周囲の批判をものともせず、自分の道を歩み続けた。", furigana: "かのじょはしゅういのひはんをものともせず、じぶんのみちをあゆみつづけた。", english: "Undaunted by criticism from those around her, she continued down her own path." }
      ]}
    ]
  },
  {
    id: "n1-nashi-ni", level: "N1", pattern: "～なしに（は）", title: "Without (formal)", short: "A formal way of saying something cannot happen without X.",
    explanation: "～なしに（は）is a formal equivalent of ～なしで／～ないで, meaning 'without X'. In the strengthened form ～なしには～ない, it emphasizes that the following outcome is entirely impossible without the stated condition.",
    usages: [
      { title: "Indispensable condition", examples: [
        { japanese: "あなたなしには生きていけない。", furigana: "あなたなしにはいきていけない。", english: "I cannot live without you." },
        { japanese: "事前の連絡なしに訪ねるのは失礼だ。", furigana: "じぜんのれんらくなしにたずねるのはしつれいだ。", english: "It's rude to visit without contacting someone beforehand." },
        { japanese: "事前の連絡なしに訪ねるのは失礼だ。", furigana: "じぜんのれんらくなしにたずねるのはしつれいだ。", english: "It's rude to visit without contacting someone beforehand." }
      ]}
    ]
  },
  {
    id: "n1-de-are", level: "N1", pattern: "～であれ / ～であろうと", title: "Whether it be / no matter", short: "States that a conclusion holds across all cases without exception.",
    explanation: "～であれ (or ～であろうと) attaches to a noun and, often repeated or paired with a question word (誰であれ, どうであれ), means 'whatever/whoever it may be, ...' — the outcome holds true no matter which case applies. It's a formal way of expressing universal indifference to a variable.",
    usages: [
      { title: "Universal application", examples: [
        { japanese: "神であれ、人間であれ、間違うことはある。", furigana: "かみであれ、にんげんであれ、まちがうことはある。", english: "Whether god or human, everyone makes mistakes." },
        { japanese: "結果がどうであれ、最善を尽くすつもりだ。", furigana: "けっかがどうであれ、さいぜんをつくすつもりだ。", english: "Whatever the outcome, I intend to do my best." },
        { japanese: "結果がどうであれ、最善を尽くすつもりだ。", furigana: "けっかがどうであれ、さいぜんをつくすつもりだ。", english: "Whatever the outcome, I intend to do my best." }
      ]}
    ]
  },
  {
    id: "n1-nn-bakari-ni", level: "N1", pattern: "～んばかりに", title: "As if about to / in a way that suggests", short: "An expression or action that looks on the verge of something.",
    explanation: "～んばかりに attaches to the negative stem of a verb (using the classical ん in place of ない) and describes someone acting or looking as if they were just about to do something extreme — crying, exploding, collapsing — without quite crossing that line. It paints a vivid, almost theatrical picture of intensity.",
    usages: [
      { title: "On the verge manner", examples: [
        { japanese: "泣かんばかりに頼み込んだ。", furigana: "なかんばかりにたのみこんだ。", english: "He begged as if he were about to cry." },
        { japanese: "今にも爆発せんばかりの怒りを見せた。", furigana: "いまにもばくはつせんばかりのいかりをみせた。", english: "He showed anger that looked as if it would explode at any moment." },
        { japanese: "今にも爆発せんばかりの怒りを見せた。", furigana: "いまにもばくはつせんばかりのいかりをみせた。", english: "He showed anger that looked as if it would explode at any moment." }
      ]}
    ]
  },
  {
    id: "n1-rashi-karanu", level: "N1", pattern: "～らしからぬ / ～らしくない", title: "Unbecoming of / unlike", short: "Behavior that contradicts what is expected of someone or something.",
    explanation: "～らしからぬ is a formal, literary way of saying something doesn't fit the qualities normally expected of a person or thing — behavior 'unbecoming of' a gentleman, a decision 'unlike' someone known for being careful. ～らしくない is its plain, everyday equivalent.",
    usages: [
      { title: "Uncharacteristic behavior", examples: [
        { japanese: "紳士らしからぬ振る舞いだった。", furigana: "しんしらしからぬふるまいだった。", english: "It was behavior unbecoming of a gentleman." },
        { japanese: "彼らしくない弱気な発言に驚いた。", furigana: "かれらしくないよわきなはつげんにおどろいた。", english: "I was surprised by such a weak-willed remark, so unlike him." },
        { japanese: "彼らしくない弱気な発言に驚いた。", furigana: "かれらしくないよわきなはつげんにおどろいた。", english: "I was surprised by such a weak-willed remark, so unlike him." }
      ]}
    ]
  },
  {
    id: "n1-akumademo", level: "N1", pattern: "あくまでも", title: "To the very end / Strictly", short: "Insists on a position or stance without wavering, no matter what.",
    explanation: "あくまでも emphasizes that a stance, claim, or approach is held firmly and without compromise, right to the very end — 'strictly speaking' or 'to the last'. It's frequently used to clarify that something is only an opinion, only a guideline, or only a provisional plan, heading off any assumption that it's more authoritative than that.",
    usages: [
      { title: "Firm stance", examples: [
        { japanese: "これはあくまでも私個人の意見です。", furigana: "これはあくまでもわたしこじんのいけんです。", english: "This is strictly my own personal opinion." },
        { japanese: "彼はあくまでも自分の主張を曲げなかった。", furigana: "かれはあくまでもじぶんのしゅちょうをまげなかった。", english: "He refused to budge from his position to the very end." },
        { japanese: "彼はあくまでも自分の主張を曲げなかった。", furigana: "かれはあくまでもじぶんのしゅちょうをまげなかった。", english: "He refused to budge from his position to the very end." }
      ]}
    ]
  },
  {
    id: "n1-annojo", level: "N1", pattern: "案の定", title: "Just as expected", short: "Something predicted (usually negatively) turns out exactly as feared.",
    explanation: "案の定 introduces a result that matches exactly what the speaker had predicted or worried about beforehand — 'sure enough' or 'just as I thought'. It almost always sets up a negative or disappointing outcome that was, in hindsight, entirely foreseeable.",
    usages: [
      { title: "Predicted outcome", examples: [
        { japanese: "無理なスケジュールだと思っていたが、案の定間に合わなかった。", furigana: "むりなスケジュールだとおもっていたが、あんのじょうまにあわなかった。", english: "I thought the schedule was unreasonable, and sure enough, we didn't make it in time." },
        { japanese: "彼は油断していた。案の定、試験に落ちた。", furigana: "かれはゆだんしていた。あんのじょう、しけんにおちた。", english: "He'd let his guard down. Sure enough, he failed the exam." }
      ]}
    ]
  },
  {
    id: "n1-arakajime", level: "N1", pattern: "あらかじめ", title: "In advance / Beforehand", short: "An action is completed ahead of time, in preparation.",
    explanation: "あらかじめ is a formal adverb meaning 'in advance' or 'beforehand', typically paired with verbs of preparation, notice, or arrangement. It's common in formal writing and instructions (あらかじめご了承ください, 'please understand in advance') where advance notice or preparation matters.",
    usages: [
      { title: "Advance preparation", examples: [
        { japanese: "あらかじめ予約しておいたほうがいいですよ。", furigana: "あらかじめよやくしておいたほうがいいですよ。", english: "You should make a reservation in advance." },
        { japanese: "参加される方は、あらかじめお名前をご登録ください。", furigana: "さんかされるかたは、あらかじめおなまえをごとうろくください。", english: "Those attending should register their name in advance." }
      ]}
    ]
  },
  {
    id: "n1-desura", level: "N1", pattern: "～ですら / ～ですらない", title: "Even (formal)", short: "A formal way to emphasize an extreme, unlikely example.",
    explanation: "～ですら is a formal, written equivalent of ～さえ, naming an extreme example to emphasize how broadly a statement applies — 'even the experts couldn't explain it' implies that lesser-qualified people certainly couldn't either. Its negative counterpart ～ですらない pushes the point even further, denying even that extreme baseline.",
    usages: [
      { title: "Formal extreme example", examples: [
        { japanese: "専門家ですら、その原因を説明できなかった。", furigana: "せんもんかですら、そのげんいんをせつめいできなかった。", english: "Even the experts couldn't explain the cause." },
        { japanese: "彼は自分の名前ですら思い出せなかった。", furigana: "かれはじぶんのなまえですらおもいだせなかった。", english: "He couldn't even remember his own name." }
      ]}
    ]
  },
  {
    id: "n1-ga-saigo", level: "N1", pattern: "～が最後", title: "Once ... (an irreversible chain begins)", short: "Once a specific action happens, an inevitable and often unwelcome consequence follows.",
    explanation: "～が最後 attaches to the た-form of a verb and warns that, once this particular action happens, an inevitable and often irreversible chain of events follows — there's no going back. It's frequently used half-jokingly about someone's well-known habits (once he starts talking, once she falls asleep) as well as more serious irreversible situations.",
    usages: [
      { title: "Irreversible trigger", examples: [
        { japanese: "彼は一度眠ったが最後、地震が来ても起きない。", furigana: "かれはいちどねむったがさいご、じしんがきてもおきない。", english: "Once he falls asleep, he won't wake up even for an earthquake." },
        { japanese: "この扉は一度閉まったが最後、外からは開けられない。", furigana: "このとびらはいちどしまったがさいご、そとからはあけられない。", english: "Once this door closes, there's no opening it from outside." }
      ]}
    ]
  },
  {
    id: "n1-hameni-naru", level: "N1", pattern: "～羽目になる", title: "End up having to (unfortunate result)", short: "Circumstances lead someone into an unwanted, often embarrassing, situation.",
    explanation: "～羽目になる attaches to the dictionary form of a verb and describes ending up in an unfortunate, often embarrassing situation as an unintended consequence of one's own choices or circumstances beyond one's control. It carries a rueful, 'how did I end up here' tone.",
    usages: [
      { title: "Unwanted result", examples: [
        { japanese: "準備を怠ったせいで、徹夜する羽目になった。", furigana: "じゅんびをおこたったせいで、てつやするはめになった。", english: "Because I neglected to prepare, I ended up having to pull an all-nighter." },
        { japanese: "電車を逃してしまい、タクシーで帰る羽目になった。", furigana: "でんしゃをのがしてしまい、タクシーでかえるはめになった。", english: "I missed the train and ended up having to take a taxi home." }
      ]}
    ]
  },
  {
    id: "n1-hougamashida", level: "N1", pattern: "～ほうがましだ", title: "Would rather / It's better to (of two bad options)", short: "Between two unappealing choices, one is still slightly preferable.",
    explanation: "～ほうがましだ compares two undesirable options and concludes that one, while still unpleasant, is at least preferable to the other. It's typically paired with くらいなら ('rather than...') and carries a resigned, slightly exaggerated tone rather than a neutral comparison.",
    usages: [
      { title: "Lesser of two evils", examples: [
        { japanese: "あんな人と仕事をするくらいなら、辞めたほうがましだ。", furigana: "あんなひととしごとをするくらいなら、やめたほうがましだ。", english: "I'd rather quit than work with someone like that." },
        { japanese: "こんな給料で働き続けるくらいなら、辞めたほうがましだ。", furigana: "こんなきゅうりょうではたらきつづけるくらいなら、やめたほうがましだ。", english: "I'd rather quit than keep working for pay like this." }
      ]}
    ]
  },
  {
    id: "n1-ikanaru", level: "N1", pattern: "いかなる～も", title: "Any kind of (formal)", short: "A formal way to say 'no matter what kind of X'.",
    explanation: "いかなる～も is a formal, literary equivalent of どんな～も, meaning 'any kind of X, without exception'. It's common in legal, official, or formal spoken contexts — statements of principle, rules that admit no exceptions.",
    usages: [
      { title: "Formal universal statement", examples: [
        { japanese: "いかなる理由があろうとも、暴力は許されない。", furigana: "いかなるりゆうがあろうとも、ぼうりょくはゆるされない。", english: "Violence is not permitted, whatever the reason may be." },
        { japanese: "いかなる困難にも屈しない覚悟だ。", furigana: "いかなるこんなんにもくっしないかくごだ。", english: "I'm prepared not to yield to any kind of hardship." }
      ]}
    ]
  },
  {
    id: "n1-imadani", level: "N1", pattern: "いまだに", title: "Still / Even now", short: "Something continues to be true well past when it was expected to change.",
    explanation: "いまだに emphasizes that a state has persisted for a surprisingly, sometimes frustratingly long time — 'still' or 'even now' — well past when the speaker might have expected it to change. It often implies mild disbelief or impatience about how long something has dragged on.",
    usages: [
      { title: "Persisting state", examples: [
        { japanese: "十年も前の出来事なのに、いまだに忘れられない。", furigana: "じゅうねんもまえのできごとなのに、いまだにわすれられない。", english: "It happened ten years ago, and yet I still can't forget it." },
        { japanese: "彼はいまだに独身だ。", furigana: "かれはいまだにどくしんだ。", english: "He's still single, even now." }
      ]}
    ]
  },
  {
    id: "n1-izureniseyo", level: "N1", pattern: "いずれにせよ / いずれにしても", title: "In any case / Either way", short: "Regardless of which possibility turns out to be true, the conclusion is the same.",
    explanation: "いずれにせよ (or いずれにしても) dismisses the need to settle a question between several possibilities, because the conclusion holds regardless of which one turns out to be true — 'in any case' or 'either way'. It's often used to move a conversation forward past an unresolved point.",
    usages: [
      { title: "Conclusion holds regardless", examples: [
        { japanese: "賛成でも反対でも、いずれにせよ話し合いは必要だ。", furigana: "さんせいでもはんたいでも、いずれにせよはなしあいはひつようだ。", english: "Whether you agree or disagree, a discussion is necessary either way." },
        { japanese: "うまくいくかどうかは分からないが、いずれにせよやってみるしかない。", furigana: "うまくいくかどうかはわからないが、いずれにせよやってみるしかない。", english: "I don't know if it'll work out, but either way, we just have to try." }
      ]}
    ]
  },
  {
    id: "n1-kahika", level: "N1", pattern: "～か否か", title: "Whether or not (formal)", short: "A formal equivalent of かどうか, common in written Japanese.",
    explanation: "～か否か is a formal, written equivalent of ～かどうか, meaning 'whether or not X'. It's common in reports, contracts, and formal speeches — 実現可能か否か ('whether or not it's feasible') — and would sound stiff or overly formal in casual conversation.",
    usages: [
      { title: "Formal uncertainty", examples: [
        { japanese: "この計画が実現可能か否か、慎重に検討する必要がある。", furigana: "このけいかくがじつげんかのうかいなか、しんちょうにけんとうするひつようがある。", english: "We need to carefully consider whether or not this plan is feasible." },
        { japanese: "この案が採用されるか否かは、来週分かります。", furigana: "このあんがさいようされるかいなかは、らいしゅうわかります。", english: "We'll find out next week whether or not this proposal is adopted." }
      ]}
    ]
  },
  {
    id: "n1-kirigainai", level: "N1", pattern: "～きりがない", title: "There's no end to", short: "An activity or line of thought could continue forever without ever concluding.",
    explanation: "～きりがない attaches to the dictionary form of a verb and means that pursuing this activity has no natural stopping point — worrying, spending, comparing — it could go on forever if you let it. It's often used as a gentle warning against over-obsessing over small details.",
    usages: [
      { title: "Endless activity", examples: [
        { japanese: "細かいことを気にしていたらきりがない。", furigana: "こまかいことをきにしていたらきりがない。", english: "If you worry about every little detail, there's no end to it." },
        { japanese: "他人と比べていたらきりがない。", furigana: "たにんとくらべていたらきりがない。", english: "If you keep comparing yourself to others, there's no end to it." }
      ]}
    ]
  },
  {
    id: "n1-kiwamaru", level: "N1", pattern: "～極まる / ～極まりない", title: "Extremely (formal)", short: "Emphasizes that a quality has reached its absolute extreme.",
    explanation: "～極まる and ～極まりない both attach to a な-adjective stem to push it to its absolute, formal extreme — 'extremely X'. Despite one form being grammatically negative, both mean the same thing; ～極まりない is somewhat more common in modern usage.",
    usages: [
      { title: "Extreme degree", examples: [
        { japanese: "彼のマナーの悪さは失礼極まりない。", furigana: "かれのマナーのわるさはしつれいきわまりない。", english: "His poor manners are extremely rude." },
        { japanese: "彼のマナーの悪さは失礼極まりない。", furigana: "かれのマナーのわるさはしつれいきわまりない。", english: "His poor manners are extremely rude." },
        { japanese: "危険極まる作業だったが、無事に終わった。", furigana: "きけんきわまるさぎょうだったが、ぶじにおわった。", english: "It was an extremely dangerous task, but it ended safely." }
      ]}
    ]
  },
  {
    id: "n1-kurainara", level: "N1", pattern: "～くらいなら", title: "Rather than (do something undesirable)", short: "Names an undesirable option only to reject it in favor of an even more extreme alternative.",
    explanation: "～くらいなら names an undesirable option as a baseline for comparison, then says that another option — however extreme it might otherwise seem — is still preferable to it. It's the classic pairing partner of ～ほうがましだ, and together they express a strong, sometimes exaggerated preference.",
    usages: [
      { title: "Rejecting the lesser evil", examples: [
        { japanese: "満員電車に乗るくらいなら、一時間歩いたほうがいい。", furigana: "まんいんでんしゃにのるくらいなら、いちじかんあるいたほうがいい。", english: "Rather than ride a packed train, I'd rather walk for an hour." },
        { japanese: "満員電車に乗るくらいなら、一時間歩いたほうがいい。", furigana: "まんいんでんしゃにのるくらいなら、いちじかんあるいたほうがいい。", english: "Rather than ride a packed train, I'd rather walk for an hour." }
      ]}
    ]
  },
  {
    id: "n1-mademonai", level: "N1", pattern: "～までもない", title: "No need to go so far as to", short: "Says an action, while possible, is more than what the situation calls for.",
    explanation: "～までもない attaches to the dictionary form of a verb and means an action, while technically possible, isn't necessary because the matter is too obvious, minor, or self-evident to require it — 'there's no need to even go that far'.",
    usages: [
      { title: "Unnecessary effort", examples: [
        { japanese: "近いから、タクシーを呼ぶまでもない。", furigana: "ちかいから、タクシーをよぶまでもない。", english: "It's close by, so there's no need to even call a taxi." },
        { japanese: "近いから、タクシーを呼ぶまでもない。", furigana: "ちかいから、タクシーをよぶまでもない。", english: "It's close by, so there's no need to even call a taxi." }
      ]}
    ]
  },
  {
    id: "n1-majiki", level: "N1", pattern: "～まじき", title: "Should not (moral impossibility)", short: "An action is utterly unacceptable given someone's role or position.",
    explanation: "～まじき attaches to the dictionary form of a verb and modifies a noun (usually 行為 or こと), condemning an action as utterly unacceptable given the role or position of the person who did it — a betrayal 'unbecoming of' a friend, negligence 'unforgivable' in a doctor. It's a strong, formal moral judgment.",
    usages: [
      { title: "Role-based prohibition", examples: [
        { japanese: "それは医者にあるまじき行為だ。", furigana: "それはいしゃにあるまじきこういだ。", english: "That is an act unbecoming of a doctor." },
        { japanese: "教師にあるまじき暴言だった。", furigana: "きょうしにあるまじきぼうげんだった。", english: "That was abusive language unbecoming of a teacher." }
      ]}
    ]
  },
  {
    id: "n1-mokaerimizu", level: "N1", pattern: "～も顧みず / ～を顧みず", title: "Without regard for / Heedless of", short: "Acting without considering one's own safety, interests, or circumstances.",
    explanation: "～も顧みず follows a noun (自分の健康, 家族, 危険) and describes acting without any regard for it — often to praise dedication or to critique recklessness, depending on context. The nuance leans toward the speaker either admiring self-sacrifice or gently criticizing carelessness.",
    usages: [
      { title: "Disregarding one's own interest", examples: [
        { japanese: "彼は自分の健康も顧みず、仕事に打ち込んだ。", furigana: "かれはじぶんのけんこうもかえりみず、しごとにうちこんだ。", english: "He threw himself into his work without regard for his own health." },
        { japanese: "危険も顧みず、彼は川に飛び込んで子供を助けた。", furigana: "きけんもかえりみず、かれはかわにとびこんでこどもをたすけた。", english: "Without regard for the danger, he jumped into the river to save the child." }
      ]}
    ]
  },
  {
    id: "n1-moshikuwa", level: "N1", pattern: "もしくは", title: "Or (formal)", short: "A formal written equivalent of または, offering an alternative.",
    explanation: "もしくは is a formal, written conjunction meaning 'or', typically found in official documents, forms, and legal writing rather than everyday speech, where または or or simple や would be more natural.",
    usages: [
      { title: "Formal alternative", examples: [
        { japanese: "本人もしくは代理人がお越しください。", furigana: "ほんにんもしくはだいりにんがおこしください。", english: "Please have either the person themselves or a representative come." },
        { japanese: "身分証明書は、運転免許証もしくはパスポートをご用意ください。", furigana: "みぶんしょうめいしょは、うんてんめんきょしょうもしくはパスポートをごようういください。", english: "For identification, please prepare either a driver's license or a passport." }
      ]}
    ]
  },
  {
    id: "n1-naidewaokanai", level: "N1", pattern: "～ないではおかない / ～ずにはおかない", title: "Will definitely / Cannot leave undone", short: "A strong feeling or circumstance makes some outcome practically inevitable.",
    explanation: "～ないではおかない (or ～ずにはおかない) attaches to the negative stem of a verb and describes a powerful feeling or external force that will inevitably bring about an action or reaction, almost as if it couldn't be stopped even if someone tried. It's often used about the effect of art, a speech, or an event on people's emotions.",
    usages: [
      { title: "Inevitable emotional force", examples: [
        { japanese: "この映画は観客を感動させないではおかない。", furigana: "このえいがはかんきゃくをかんどうさせないではおかない。", english: "This movie is bound to move its audience." },
        { japanese: "その事件は世間に衝撃を与えないではおかないだろう。", furigana: "そのじけんはせけんにしょうげきをあたえないではおかないだろう。", english: "That incident is bound to shock the public." }
      ]}
    ]
  },
  {
    id: "n1-naidewasumanai", level: "N1", pattern: "～ないでは済まない / ～ずには済まない", title: "Must / Cannot get away without", short: "Social or moral pressure makes an action unavoidable.",
    explanation: "～ないでは済まない (or ～ずには済まない) attaches to the negative stem of a verb and means that skipping the action isn't socially or morally acceptable — something must be done, typically to make amends or take responsibility. It carries real social pressure, distinct from simple necessity.",
    usages: [
      { title: "Unavoidable obligation", examples: [
        { japanese: "こんな大失敗をしたら、謝らないでは済まない。", furigana: "こんなだいしっぱいをしたら、あやまらないではすまない。", english: "After a mistake this big, I can't get away without apologizing." },
        { japanese: "会社に大きな損害を与えたのだから、責任を取らないでは済まない。", furigana: "かいしゃにおおきなそんがいをあたえたのだから、せきにんをとらないではすまない。", english: "Since he caused the company such a big loss, he can't get away without taking responsibility." }
      ]}
    ]
  },
  {
    id: "n1-naimonoka", level: "N1", pattern: "～ないものか", title: "Isn't there some way to ...?", short: "A wish, phrased as a rhetorical question, that a solution could be found.",
    explanation: "～ないものか attaches to the negative stem of a verb and phrases a strong, often frustrated wish as a rhetorical question — 'isn't there some way that X could happen?'. It's typically used when the speaker has already tried other approaches and is searching, somewhat desperately, for a solution.",
    usages: [
      { title: "Wishful rhetorical question", examples: [
        { japanese: "何とかこの問題を解決できないものか。", furigana: "なんとかこのもんだいをかいけつできないものか。", english: "Isn't there some way we could solve this problem?" },
        { japanese: "もう少し早く終わらせられないものか。", furigana: "もうすこしはやくおわらせられないものか。", english: "Isn't there some way to finish this a bit sooner?" }
      ]}
    ]
  },
  {
    id: "n1-ni-atai-suru", level: "N1", pattern: "～に値する", title: "Worth / Deserving of", short: "Something has enough merit to genuinely deserve a particular treatment.",
    explanation: "～に値する follows a noun (賞賛, 尊敬, 信頼) or the dictionary form of a verb, and states that something has enough genuine merit to deserve that treatment or reaction. It's a formal, evaluative expression, common in written commentary and speeches praising someone's achievement.",
    usages: [
      { title: "Genuine merit", examples: [
        { japanese: "彼の勇気ある行動は称賛に値する。", furigana: "かれのゆうきあるこうどうはしょうさんにあたいする。", english: "His courageous action is worthy of praise." },
        { japanese: "この研究成果は国際的な評価に値する。", furigana: "このけんきゅうせいかはこくさいてきなひょうかにあたいする。", english: "This research achievement deserves international recognition." }
      ]}
    ]
  },
  {
    id: "n1-niatarazu", level: "N1", pattern: "～に（は）当たらない", title: "Not worth / No need to", short: "Something doesn't merit the strong reaction someone might have toward it.",
    explanation: "～に（は）当たらない follows a noun describing a strong reaction (驚く, 非難する, 感謝する) and says the situation doesn't actually warrant that level of response — it isn't surprising, blameworthy, or exceptional enough. It's often used to talk someone down from an overreaction.",
    usages: [
      { title: "Doesn't merit a reaction", examples: [
        { japanese: "彼の失敗は責めるに当たらない。誰にでもあることだ。", furigana: "かれのしっぱいはせめるにあたらない。だれにでもあることだ。", english: "His mistake doesn't deserve blame. It could happen to anyone." },
        { japanese: "この程度のミスは驚くには当たらない。", furigana: "このていどのミスはおどろくにはあたらない。", english: "A mistake of this level isn't anything to be surprised about." }
      ]}
    ]
  },
  {
    id: "n1-nihikikae", level: "N1", pattern: "～にひきかえ", title: "In contrast to / Unlike", short: "Draws a sharp, often surprising, contrast between two things.",
    explanation: "～にひきかえ draws a sharp, sometimes surprising contrast between two things, people, or situations — 'in stark contrast to X'. It's stronger and more pointed than a plain が or けど, and works especially well when the contrast itself is the whole point of the sentence.",
    usages: [
      { title: "Sharp contrast", examples: [
        { japanese: "兄の陽気な性格にひきかえ、弟はとても内気だ。", furigana: "あにのようきなせいかくにひきかえ、おとうとはとてもうちきだ。", english: "In contrast to his cheerful older brother, the younger one is very shy." },
        { japanese: "去年の売り上げにひきかえ、今年は大きく伸びた。", furigana: "きょねんのうりあげにひきかえ、ことしはおおきくのびた。", english: "In stark contrast to last year's sales, this year saw significant growth." }
      ]}
    ]
  },
  {
    id: "n1-niitarumade", level: "N1", pattern: "～に至るまで", title: "Even down to / Up until", short: "Emphasizes the full range or extent, right down to the smallest detail or furthest point.",
    explanation: "～に至るまで follows a noun and emphasizes that a statement covers absolutely everything, right down to the smallest or most unexpected detail — or, with a starting point marked by から, that a range extends all the way up to that far point.",
    usages: [
      { title: "Full extent", examples: [
        { japanese: "彼は家具のデザインから素材の選定に至るまで、すべて自分で決めた。", furigana: "かれはかぐのデザインからそざいのせんていにいたるまで、すべてじぶんできめた。", english: "From the furniture design down to the choice of materials, he decided everything himself." },
        { japanese: "彼は幼少期の記憶に至るまで、鮮明に覚えている。", furigana: "かれはようしょうきのきおくにいたるまで、せんめいにおぼえている。", english: "He remembers vividly, right down to his memories from early childhood." }
      ]}
    ]
  },
  {
    id: "n1-niitatteha", level: "N1", pattern: "～に至っては", title: "When it comes to / As for (an extreme case)", short: "Singles out an extreme example within a larger group to make a point.",
    explanation: "～に至っては singles out one particularly extreme example from within a larger group that was already being criticized or discussed, then makes a pointed comment specifically about that one case — 'when it comes to X (of all things), ...'.",
    usages: [
      { title: "Extreme example within a group", examples: [
        { japanese: "他の教科もひどいが、数学に至っては赤点だった。", furigana: "ほかのきょうかもひどいが、すうがくにいたってはあかてんだった。", english: "The other subjects were bad enough, but when it comes to math, I got a failing grade." },
        { japanese: "社員の遅刻も問題だが、部長の遅刻に至っては話にならない。", furigana: "しゃいんのちこくももんだいだが、ぶちょうのちこくにいたってははなしにならない。", english: "Employees being late is already a problem, but when it comes to the department head being late, it's beyond ridiculous." }
      ]}
    ]
  },
  {
    id: "n1-nikakatteiru", level: "N1", pattern: "～にかかっている", title: "Depends entirely on", short: "The entire outcome rests on a single decisive factor.",
    explanation: "～にかかっている follows a noun and states that an entire outcome hinges on that one decisive factor — everything else is secondary to it. It's often used to raise the stakes on a single moment, decision, or person.",
    usages: [
      { title: "Decisive factor", examples: [
        { japanese: "この試合の勝敗は、最後の一球にかかっている。", furigana: "このしあいのしょうはいは、さいごのいっきゅうにかかっている。", english: "The outcome of this game depends entirely on the last pitch." },
        { japanese: "会社の将来は、この新製品の成功にかかっている。", furigana: "かいしゃのしょうらいは、このしんせいひんのせいこうにかかっている。", english: "The company's future depends on this new product's success." }
      ]}
    ]
  },
  {
    id: "n1-nimo-hodo-ga-aru", level: "N1", pattern: "～にもほどがある", title: "There's a limit to / Going too far", short: "Criticizes something as an extreme, unacceptable degree of a trait.",
    explanation: "～にもほどがある follows a noun or plain-form phrase and criticizes it as having gone too far — 'there's a limit to X, and this has exceeded it'. It's an exasperated, sometimes exaggerated way of expressing that something is unacceptable in its extremity.",
    usages: [
      { title: "Excessive degree", examples: [
        { japanese: "遅刻するにもほどがある。もう二時間も待っているよ。", furigana: "ちこくするにもほどがある。もうにじかんもまっているよ。", english: "There's a limit to being late! I've already been waiting two hours." },
        { japanese: "わがままにもほどがある。", furigana: "わがままにもほどがある。", english: "There's a limit to how selfish you can be!" }
      ]}
    ]
  },
  {
    id: "n1-nisakigakete", level: "N1", pattern: "～に先駆けて", title: "Ahead of / Before anyone else", short: "Being the first to do something, before others follow.",
    explanation: "～に先駆けて follows a noun (often a time period or event) and means doing something before everyone else — taking the lead ahead of the rest of an industry, region, or group. It's common in business and news writing praising a company or region's early adoption of something.",
    usages: [
      { title: "Being first", examples: [
        { japanese: "この会社は業界に先駆けて新技術を導入した。", furigana: "このかいしゃはぎょうかいにさきがけてしんぎじゅつをどうにゅうした。", english: "This company introduced the new technology ahead of the rest of the industry." },
        { japanese: "この地域は全国に先駆けて再生可能エネルギーを導入した。", furigana: "このちいきはぜんこくにさきがけてさいせいかのうエネルギーをどうにゅうした。", english: "This region introduced renewable energy ahead of the rest of the country." }
      ]}
    ]
  },
  {
    id: "n1-nitodomarazu", level: "N1", pattern: "～にとどまらず", title: "Not limited to / Going beyond", short: "An effect or scope extends further than just the initial, expected area.",
    explanation: "～にとどまらず follows a noun and means the scope of an effect or situation isn't confined to it, but extends well beyond — 'not limited to X' or 'going far beyond just X'. It's frequently used to show that something's impact is bigger than it might first appear.",
    usages: [
      { title: "Extended scope", examples: [
        { japanese: "その影響は国内にとどまらず、世界中に広がった。", furigana: "そのえいきょうはこくないにとどまらず、せかいじゅうにひろがった。", english: "The impact wasn't limited to the country — it spread across the whole world." },
        { japanese: "彼女の活躍は音楽界にとどまらず、映画界にも及んでいる。", furigana: "かのじょのかつやくはおんがくかいにとどまらず、えいがかいにもおよんでいる。", english: "Her success isn't limited to the music world — it extends into film as well." }
      ]}
    ]
  },
  {
    id: "n1-niwaoyobanai", level: "N1", pattern: "～には及ばない", title: "There's no need to / Doesn't measure up to", short: "Says an action is unnecessary, or that one thing doesn't reach the level of another.",
    explanation: "～には及ばない has two related senses: softening a suggestion by saying there's no need to go as far as X (a polite way to decline an overly generous offer), or, following a comparison, saying that one thing simply doesn't measure up to another.",
    usages: [
      { title: "Unnecessary effort", examples: [
        { japanese: "電話で十分ですから、わざわざ来ていただくには及びません。", furigana: "でんわでじゅうぶんですから、わざわざきていただくにはおよびません。", english: "A phone call is enough, so there's no need for you to go out of your way to come." },
        { japanese: "彼の実力は、まだプロには及ばない。", furigana: "かれのじつりょくは、まだプロにはおよばない。", english: "His skill still doesn't measure up to a professional's." }
      ]}
    ]
  },
  {
    id: "n1-no-kiwami", level: "N1", pattern: "～の極み", title: "The utmost / The height of", short: "A formal way to say something has reached its absolute peak.",
    explanation: "～の極み is a formal, somewhat literary way to say something has reached its absolute peak — 'the height of X' or 'the utmost of X'. It attaches to emotional or evaluative nouns (感激, 贅沢, 疲労) and shows up in formal speeches, acceptance remarks, and elevated writing.",
    usages: [
      { title: "Utmost degree", examples: [
        { japanese: "こんな素晴らしい賞をいただき、感激の極みです。", furigana: "こんなすばらしいしょうをいただき、かんげきのきわみです。", english: "Receiving such a wonderful award is the height of my emotion." },
        { japanese: "毎日豪華な食事とは、贅沢の極みだ。", furigana: "まいにちごうかなしょくじとは、ぜいたくのきわみだ。", english: "A gorgeous meal every day is the height of luxury." }
      ]}
    ]
  },
  {
    id: "n1-wo-fumaete", level: "N1", pattern: "～を踏まえて", title: "Based on / In light of", short: "Uses given information as the foundation for a following judgment or plan.",
    explanation: "～を踏まえて follows a noun describing information, results, or opinions already gathered, and means using it as the basis for a following judgment, decision, or plan. It's a standard formal expression in business and academic writing for building on prior findings.",
    usages: [
      { title: "Foundation for judgment", examples: [
        { japanese: "今回の調査結果を踏まえて、新しい方針を決定します。", furigana: "こんかいのちょうさけっかをふまえて、あたらしいほうしんをけっていします。", english: "We will decide on a new policy based on the results of this survey." },
        { japanese: "皆さんのご意見を踏まえて、計画を修正いたします。", furigana: "みなさんのごいけんをふまえて、けいかくをしゅうせいいたします。", english: "We will revise the plan based on everyone's feedback." }
      ]}
    ]
  },
  {
    id: "n1-wo-hete", level: "N1", pattern: "～を経て", title: "Through / After (a process)", short: "Reaching a result only after passing through a certain process or period.",
    explanation: "～を経て follows a noun describing a process, stage, or period of time, meaning that a following result was only reached after passing through it. It emphasizes the journey or process leading up to an outcome, not just the outcome itself.",
    usages: [
      { title: "Process leading to a result", examples: [
        { japanese: "長い交渉を経て、ようやく契約が成立した。", furigana: "ながいこうしょうをへて、ようやくけいやくがせいりつした。", english: "After lengthy negotiations, the contract was finally concluded." },
        { japanese: "彼は数々の困難を経て、今の地位を築いた。", furigana: "かれはかずかずのこんなんをへて、いまのちいをきずいた。", english: "He built his current standing after going through numerous hardships." }
      ]}
    ]
  },
  {
    id: "n1-wo-iikotoni", level: "N1", pattern: "～をいいことに", title: "Taking advantage of", short: "Exploiting a favorable circumstance, often selfishly or improperly.",
    explanation: "～をいいことに follows a noun describing a convenient circumstance and means someone is taking selfish or improper advantage of it — the phrase carries a clearly critical tone, unlike neutral expressions of taking an opportunity.",
    usages: [
      { title: "Selfish exploitation", examples: [
        { japanese: "彼は上司が不在なのをいいことに、仕事をさぼっていた。", furigana: "かれはじょうしがふざいなのをいいことに、しごとをさぼっていた。", english: "Taking advantage of his boss being away, he was slacking off at work." },
        { japanese: "誰も見ていないのをいいことに、彼はルールを破った。", furigana: "だれもみていないのをいいことに、かれはルールをやぶった。", english: "Taking advantage of no one watching, he broke the rules." }
      ]}
    ]
  },
  {
    id: "n1-wo-kanete", level: "N1", pattern: "～を兼ねて", title: "Also serving as / Combined with the purpose of", short: "A single action serves two purposes at once.",
    explanation: "～を兼ねて follows a noun describing a secondary purpose, meaning the main action also serves that additional goal at the same time — one trip, two purposes. It's a neutral, practical expression, common when describing errands or trips that accomplish more than one thing.",
    usages: [
      { title: "Dual purpose", examples: [
        { japanese: "気分転換を兼ねて、近くの公園を散歩した。", furigana: "きぶんてんかんをかねて、ちかくのこうえんをさんぽした。", english: "I took a walk in the nearby park, partly to clear my head." },
        { japanese: "研究発表を兼ねて、久しぶりに海外へ出張することになった。", furigana: "けんきゅうはっぴょうをかねて、ひさしぶりにかいがいへしゅっちょうすることになった。", english: "Combined with a research presentation, I'm going on an overseas business trip for the first time in a while." }
      ]}
    ]
  },
  {
    id: "n1-wo-kini", level: "N1", pattern: "～を機に", title: "As an opportunity of / Taking X as a turning point", short: "An event becomes the trigger or turning point for a new development.",
    explanation: "～を機に follows a noun describing an event and means that event served as the trigger or turning point for a following change — a life event (marriage, an illness, a milestone birthday) prompting a new direction.",
    usages: [
      { title: "Turning point", examples: [
        { japanese: "結婚を機に、田舎に引っ越すことにした。", furigana: "けっこんをきに、いなかにひっこすことにした。", english: "Taking our marriage as an opportunity, we decided to move to the countryside." },
        { japanese: "定年退職を機に、田舎で農業を始めた人もいる。", furigana: "ていねんたいしょくをきに、いなかでのうぎょうをはじめたひともいる。", english: "Some people, taking retirement as an opportunity, start farming in the countryside." }
      ]}
    ]
  },
  {
    id: "n1-wo-kinjienai", level: "N1", pattern: "～を禁じ得ない", title: "Cannot help but feel", short: "A strong emotion is impossible to suppress, given the circumstances.",
    explanation: "～を禁じ得ない follows an emotional noun (涙, 怒り, 疑問) and means the speaker cannot suppress that feeling given the circumstances — a formal, literary way of admitting an emotion has overwhelmed one's self-control.",
    usages: [
      { title: "Uncontainable emotion", examples: [
        { japanese: "被害者の話を聞いて、涙を禁じ得なかった。", furigana: "ひがいしゃのはなしをきいて、なみだをきんじえなかった。", english: "Hearing the victim's story, I couldn't hold back my tears." },
        { japanese: "この結果には、疑問を禁じ得ない。", furigana: "このけっかには、ぎもんをきんじえない。", english: "I can't help but feel doubtful about this result." }
      ]}
    ]
  },
  {
    id: "n1-samonaito", level: "N1", pattern: "さもないと", title: "Otherwise / Or else", short: "Warns that failing to act will lead to a bad consequence.",
    explanation: "さもないと follows an instruction or condition and warns that failing to comply will lead to a negative consequence — 'otherwise' or 'or else'. It has a slightly stern, cautionary tone, often used when giving someone a deadline or a rule to follow.",
    usages: [
      { title: "Warning of consequence", examples: [
        { japanese: "早く出発しなさい。さもないと、電車に遅れますよ。", furigana: "はやくしゅっぱつしなさい。さもないと、でんしゃにおくれますよ。", english: "Leave now. Otherwise, you'll miss the train." },
        { japanese: "薬はきちんと飲んでください。さもないと、症状が悪化しますよ。", furigana: "くすりはきちんとのんでください。さもないと、しょうじょうがあっかしますよ。", english: "Please take your medicine properly. Otherwise, your symptoms will get worse." }
      ]}
    ]
  },
  {
    id: "n1-tekkiri", level: "N1", pattern: "てっきり", title: "I was (mistakenly) sure that", short: "Reveals that a confident assumption turned out to be wrong.",
    explanation: "てっきり pairs with と思っていた (or a similar phrase) to describe a belief the speaker held with total confidence, which then turns out to have been wrong — 'I was absolutely sure that...'. The word itself signals that a correction or surprise is coming.",
    usages: [
      { title: "Mistaken confidence", examples: [
        { japanese: "てっきり彼が犯人だと思っていたが、違ったようだ。", furigana: "てっきりかれがはんにんだとおもっていたが、ちがったようだ。", english: "I was completely sure he was the culprit, but it seems I was wrong." },
        { japanese: "てっきり中止になったと思っていたら、開催されていた。", furigana: "てっきりちゅうしになったとおもっていたら、かいさいされていた。", english: "I was completely sure it had been cancelled, but it turned out to be happening after all." }
      ]}
    ]
  },
  {
    id: "n1-toareba", level: "N1", pattern: "～とあれば", title: "If it's the case that / If it comes to that", short: "Given a specific condition, an otherwise unusual action becomes justified.",
    explanation: "～とあれば attaches to a noun or plain-form phrase and means 'if it's a matter of X' — implying that X is significant enough to justify going to unusual lengths for. It sets up a condition that, once met, makes an otherwise surprising level of effort or sacrifice understandable.",
    usages: [
      { title: "Condition justifying action", examples: [
        { japanese: "子供のためとあれば、どんな苦労も惜しまない。", furigana: "こどものためとあれば、どんなくろうもおしまない。", english: "If it's for my child's sake, I won't spare any effort, however hard." },
        { japanese: "君の頼みとあれば、断るわけにはいかない。", furigana: "きみのたのみとあれば、ことわるわけにはいかない。", english: "If it's a request from you, I can't refuse." }
      ]}
    ]
  },
  {
    id: "n1-toiedomo", level: "N1", pattern: "～といえども", title: "Even / Even though (formal)", short: "A formal concessive, conceding a point before making a stronger claim.",
    explanation: "～といえども is a formal, literary concessive attaching to a noun or plain-form phrase, meaning 'even though' or 'even granting that' — a heavier, more written-register alternative to ても or けれども, common in essays and formal argument.",
    usages: [
      { title: "Formal concession", examples: [
        { japanese: "専門家といえども、間違えることはある。", furigana: "せんもんかといえども、まちがえることはある。", english: "Even experts can make mistakes." },
        { japanese: "子供といえども、嘘をつくことは許されない。", furigana: "こどもといえども、うそをつくことはゆるされない。", english: "Even granting that they're a child, lying isn't acceptable." }
      ]}
    ]
  },
  {
    id: "n1-toiuwakeda", level: "N1", pattern: "～というわけだ", title: "That means / So that's why", short: "Draws a natural conclusion by connecting the dots from what was just discussed.",
    explanation: "～というわけだ attaches to a plain-form sentence to state a conclusion that logically follows from context already established — 'so, that means...' or 'that's why...'. It signals that the speaker is connecting the dots rather than introducing brand-new information.",
    usages: [
      { title: "Logical conclusion", examples: [
        { japanese: "電車が止まっていた。つまり、遅刻したのは仕方なかったというわけだ。", furigana: "でんしゃがとまっていた。つまり、ちこくしたのはしかたなかったというわけだ。", english: "The train had stopped. In other words, being late couldn't be helped." },
        { japanese: "彼は昨日徹夜したらしい。だから今日眠そうというわけだ。", furigana: "かれはきのうてつやしたらしい。だからきょうねむそうというわけだ。", english: "Apparently he stayed up all night yesterday. So that's why he looks sleepy today." }
      ]}
    ]
  },
  {
    id: "n1-tomosureba", level: "N1", pattern: "ともすれば / ともすると", title: "Apt to / Prone to", short: "Warns that a situation easily tends to slip toward an undesirable outcome.",
    explanation: "ともすれば (or ともすると) warns that a situation easily tends to slip toward a certain, usually undesirable, outcome if one isn't careful — 'apt to' or 'prone to'. It's often paired with がち or 〜になる at the end of the sentence.",
    usages: [
      { title: "Easy tendency", examples: [
        { japanese: "一人暮らしはともすれば不規則な生活になりがちだ。", furigana: "ひとりぐらしはともすればふきそくなせいかつになりがちだ。", english: "Living alone is apt to lead to an irregular lifestyle if you're not careful." },
        { japanese: "忙しいと、ともすれば健康管理がおろそかになる。", furigana: "いそがしいと、ともすればけんこうかんりがおろそかになる。", english: "When you're busy, you're apt to neglect taking care of your health." }
      ]}
    ]
  },
  {
    id: "n1-to-omoikiya", level: "N1", pattern: "～と思いきや", title: "I thought ..., but", short: "An expectation is unexpectedly overturned by what actually happens.",
    explanation: "～と思いきや attaches to a plain-form phrase representing the speaker's expectation, then reveals that reality turned out differently — often surprisingly so. It's a literary, narrative device for building in a twist.",
    usages: [
      { title: "Overturned expectation", examples: [
        { japanese: "簡単に終わると思いきや、予想以上に時間がかかった。", furigana: "かんたんにおわるとおもいきや、よそういじょうにじかんがかかった。", english: "I thought it would finish easily, but it ended up taking far longer than expected." },
        { japanese: "彼は反対すると思いきや、あっさり賛成した。", furigana: "かれははんたいするとおもいきや、あっさりさんせいした。", english: "I thought he'd object, but he agreed without any fuss." }
      ]}
    ]
  },
  {
    id: "n1-toriwake", level: "N1", pattern: "とりわけ", title: "Especially / Above all", short: "Singles out one item as standing out even more than the rest of an already notable group.",
    explanation: "とりわけ singles out one item from a group already described as notable, meaning it stands out even more than the rest — 'especially' or 'above all'. It's a formal-leaning adverb, common in writing that's already praising or highlighting something and wants to point to the best example within it.",
    usages: [
      { title: "Standing out even more", examples: [
        { japanese: "今年は暑い日が多かったが、とりわけ八月は記録的な猛暑だった。", furigana: "ことしはあついひがおおかったが、とりわけはちがつはきろくてきなもうしょだった。", english: "There were many hot days this year, but August especially was a record-breaking heatwave." },
        { japanese: "彼の作品はどれも素晴らしいが、とりわけこの一枚が印象的だ。", furigana: "かれのさくひんはどれもすばらしいが、とりわけこのいちまいがいんしょうてきだ。", english: "All of his works are wonderful, but this one piece is especially striking." }
      ]}
    ]
  },
  {
    id: "n1-towaie", level: "N1", pattern: "～とはいえ", title: "Nonetheless / That said (formal)", short: "Concedes a fact, then immediately notes an important qualification.",
    explanation: "～とはいえ attaches to a plain-form phrase to acknowledge a preceding fact, then immediately adds an important qualification — 'that said' or 'even so'. It's a formal, written-register equivalent of だけど or でも, common in essays and reports that want to sound balanced.",
    usages: [
      { title: "Formal qualification", examples: [
        { japanese: "景気が回復しているとはいえ、まだ油断はできない。", furigana: "けいきがかいふくしているとはいえ、まだゆだんはできない。", english: "The economy is recovering, but even so, we can't let our guard down yet." },
        { japanese: "台風は過ぎたとはいえ、まだ油断はできない。", furigana: "たいふうはすぎたとはいえ、まだゆだんはできない。", english: "The typhoon has passed, but even so, we still can't let our guard down." }
      ]}
    ]
  },
  {
    id: "n1-haoroka", level: "N1", pattern: "～はおろか", title: "Let alone / Not to mention", short: "Denies a basic claim, then makes clear an even more advanced one is equally impossible.",
    explanation: "～はおろか follows a noun representing a basic case, denies it, then adds that an even more demanding case is likewise impossible — 'let alone' or 'never mind'. It's a strong rhetorical device: mentioning the easier case first makes the impossibility of the harder one land with more force.",
    usages: [
      { title: "Even the basic case fails", examples: [
        { japanese: "彼は漢字はおろか、ひらがなも書けない。", furigana: "かれはかんじはおろか、ひらがなもかけない。", english: "He can't even write hiragana, let alone kanji." },
        { japanese: "食事はおろか、水も喉を通らなかった。", furigana: "しょくじはおろか、みずものどをとおらなかった。", english: "Never mind food — I couldn't even get water down." }
      ]}
    ]
  }
];
