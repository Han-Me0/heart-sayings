CREATE DATABASE IF NOT EXISTS idioms;

USE idioms;

CREATE TABLE idioms (
  language VARCHAR(255),
  idiom VARCHAR(255),
  meaning VARCHAR(255),
  idiom_translation VARCHAR(255), 
  meaning_translation VARCHAR(255)
) DEFAULT CHARSET=utf8;

INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('English','Close to your heart','If something is close to your heart, you care a lot about it.','n/a','n/a'),
	 ('English','Heart of gold','Someone with a heart of gold is a genuinely kind and caring person.','n/a','n/a'),
	 ('English','Heart is not in it','If your heart is not in something, then you do not really believe in it or support it.','n/a','n/a'),
	 ('English','Heart in your mouth','If your heart is in your mouth, then you feel nervous or scared.','n/a','n/a'),
	 ('English','Heart in your boots','If your heart is in your boots, you are very unhappy.','n/a','n/a'),
	 ('English','Heart misses a beat','If your heart misses a beat, you are suddenly shocked or surprised.','n/a','n/a'),
	 ('English','Heart in the right place','If someone''s heart is in the right place, they are good and kind, though they might not always appear to be so.','n/a','n/a'),
	 ('English','By heart','If you learn something by heart, you learn it word for word.','n/a','n/a'),
	 ('English','My heart bleeds','If your heart bleeds for someone, you feel genuine sympathy and sadness for them.','n/a','n/a'),
	 ('English','Open your heart','To talk in a very open and honest way about one''s feelings.','n/a','n/a');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('English','All heart','Someone who is all heart is very kind and generous.','n/a','n/a'),
	 ('English','In a heartbeat','If something happens very quickly or immediately, it happens in a heartbeat.','n/a','n/a'),
	 ('English','My heart goes out to someone','If your heart goes out to someone, you feel genuine sympathy for them.','n/a','n/a'),
	 ('English','Hale and hearty','Someone who is hale and hearty is in very good health.','n/a','n/a'),
	 ('English','Queen of Hearts','A woman who is pre-eminent in her area is a Queen of Hearts.','n/a','n/a'),
	 ('English','Bleeding heart','A bleeding heart is a person who is excessively sympathetic towards other people.','n/a','n/a'),
	 ('English','Eat your heart out','If someone tells you to eat your heart out, they are saying they are better than you at something.','n/a','n/a'),
	 ('English','Bare your heart','If you bare your heart to someone, you tell them your personal and private feelings.','n/a','n/a'),
	 ('English','Change of heart','If you change the way you think or feel about something, you have a change of heart.','n/a','n/a'),
	 ('English','After your own heart','A person after your own heart thinks the same way as you.','n/a','n/a');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('English','Put your hand on your heart','If you put your hand on your heart, then you can say something knowing it to be true.','n/a','n/a'),
	 ('English','Absence makes the heart grow fonder','This idiom means that when people are apart, their love grows stronger.','n/a','n/a'),
	 ('English','Warm the cockles of your heart','If something warms the cockles of your heart, it makes you feel happy.','n/a','n/a'),
	 ('English','From the bottom of your heart','If someone does something from the bottom of their heart, then they do it with genuine emotion and feeling.','n/a','n/a'),
	 ('Swedish','I hjärtat av något','I centrum; i den viktigaste delen.','In the heart of something','In the center; in the most important part.'),
	 ('German','Etwas auf dem Herzen haben','Ein persönliches Anliegen haben; bedrückt sein, sich Sorgen um, über etwas machen.','To have something on one''s mind','To be worried about something.'),
	 ('German','Sich etwas zu Herzen nehmen','Betroffen sein, etwas schwer nehmen.','To take something to heart','To take something seriously or emotionally.'),
	 ('German','Seinem Herzen einen Stoß geben','Die Zurückhaltung, Ängstlichkeit durch raschen Entschluss überwinden.','To give your heart a push','Overcoming reticence and fear through quick decision.'),
	 ('German','Sein Herz ausschütten','Mitteilen, was einen bewegt, bekümmert, belastet.','To pour out one''s heart','To share one''s worries or troubles.'),
	 ('German','Aus seinem Herzen keine Mördergrube machen','Offen äußern, was man denkt und empfindet.','Don''t make your heart a den of murderers','To speak openly about what one thinks and feels.');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('German','Wes das Herz voll ist, des geht der Mund','Wer starke Emotionen verspürt, möchte sie auch gerne anderen mitteilen.','What the heart is full of, the mouth speaks of.','To express one''s strong emotions openly.'),
	 ('German','Ein Herz und eine Seele','Eine sehr enge Bindung zueinander haben, sehr eng befreundet sein.','One heart and one soul.','To be inseparable; to have a very close bond or friendship.'),
	 ('German','Jemandem aus dem Herzen sprechen','Jemandes Emotionen / Meinung wiedergeben.','Speaking from the heart to someone.','To voice someone''s emotions or opinion.'),
	 ('Swedish','Ligga någon varmt om hjärtat','Vara viktigt för någon; hysa starkt intresse för något.','To hold someone close to your heart','To be dear to someone''s heart; to have a strong interest in something.'),
	 ('Swedish','Med hjärtat i halsgropen','Vara väldigt rädd; dödsförskräckt.','With the heart in the pit of the throat','To be very scared.'),
	 ('Swedish','Handen på hjärtat','Om du är uppriktig; ärligt talat.','Hand on heart','Be honest; honestly speaking.'),
	 ('Swedish','Finns det hjärterum så finns det stjärterum','Om man bara vill så får alla plats även om det blir trångt.','If there is room for the heart, there is room for the tail.','If there''s room in your heart, there''s room in your house; if you''re willing, everyone can fit.'),
	 ('Swedish','Hjärtat på rätt ställe','Att vara god, medmänsklig.','Heart in the right place.','To be good, humane.'),
	 ('Swedish','Skänka någon sitt hjärta','Vilja leva sitt liv tillsammans med någon.','To give someone your heart.','To want to spend your life with someone.'),
	 ('Swedish','Komma från hjärtat','Att påstå någonting spontant, och/eller ärligt och uppriktigt.','To come from the heart.','To speak honestly and sincerely.');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('German','Jemandem fällt ein Stein vom Herzen','Jemand ist erleichtert, weil sich eine Befürchtung nicht bewahrheitet hat.','A weight is lifted from someone''s shoulders.','Someone is relieved because a fear did not come true.'),
	 ('Swedish','Krossa någons hjärta','Att göra någon djupt olycklig.','To break someone''s heart.','To make someone deeply unhappy.'),
	 ('German','Hand aufs Herz!','Sei ehrlich! Sag die Wahrheit!','Hand on heart!','Be honest! Tell the truth!'),
	 ('German','Jemanden ins Herz schließen','Jemanden lieb gewinnen.','Taking someone into your heart.','To love someone.'),
	 ('German','Das Herz auf der Zunge tragen','Offen über seine Gefühle sprechen; sofort sagen, was einen beschäftigt.','To wear one''s heart on their sleeve.','To openly speak about feelings; To say immediately what is bothering you.'),
	 ('German','Das Herz am rechten Fleck haben','Uneigennützig, hilfsbereit und nett sein, gute Absichten haben, ehrlich sein.','To have your heart in the right place','To be selfless, kind, and well-intentioned.'),
	 ('German','Sich ein Herz fassen','Tapfer, mutig sein, sich überwinden.','To take heart.','To muster bravery and overcome hesitation.'),
	 ('German','Herzzerreißend sein oder Jemandem das Herz zerreißen','Jemanden sehr bekümmern, tiefes Mitgefühl in ihm wecken.','To be heartbreaking or to break someone''s heart.','To cause great emotional distress.'),
	 ('Ukrainian','Полонити серце','Дуже сподобатися кому-небудь.','To captivate someone''s heart.','To really like someone.'),
	 ('Ukrainian','Розуміти серцем','Відчувати, інтуїтивно здогадуватися.','To understand with your heart.','To feel intuitively.');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('Ukrainian','Велике серце','Якщо хто-небудь дуже добрий, чуйний, здатний глибоко перейматися чужими переживаннями та допомогти.','To have a big heart.','To be kind and compassionate.'),
	 ('Ukrainian','Відкрите серце','Якщо хто-небудь відвертий та сповнений доброзичливості.','To have an open heart.','To be sincere and full of goodwill.'),
	 ('Ukrainian','Скрипіти серцем','Робити що-небудь дуже неохоче, всупереч власному бажанню.','Creaking heart.','To do something very reluctantly, against one''s own wishes.'),
	 ('Ukrainian','Тане серце','Якщо хто-небудь сповнюється приємними почуттями піддаючись впливом когось або чогось приємного.','The heart melts.','To be filled with pleasant emotions influenced by something or someone.'),
	 ('Ukrainian','Брати до серця','Ставитись співчутливо. Заряче та боляче реагувати на щось.','To take to heart.','To respond compassionately or emotionally to something.'),
	 ('Ukrainian','З легким серцем','Без роздумів, без тривог.','With a light heart.','Without worry or hesitation.'),
	 ('Ukrainian','За покликом серця','Робити щось відповідно своїх прагнень, почуттів та бажань.','By the call of the heart.','To act according to one''s desires and feelings.'),
	 ('Ukrainian','Кам’яне серце','Жорстока бездушна людина.','Heart of stone.','A cruel and heartless person.'),
	 ('Ukrainian','Серце крається','Буде сильно переживати за когось, страждати.','The heart aches.','To deeply worry about someone or suffer.'),
	 ('Ukrainian','Мати Бога в серці','Бути дуже милосердним, жалісливим, совісним, справедливим.','Having God in the heart','To be very kind, compassionate, and fair.');
INSERT INTO idioms.idioms (language,idiom,meaning,idiom_translation,meaning_translation) VALUES
	 ('Ukrainian','Лицар серця','Об''єкт чийогось кохання, коханий.','A knight of the heart.','An object of someone''s affection or a beloved person.'),
	 ('Ukrainian','Нести тягар на серці','Зазнавати душевних страждань та тяжких переживань за когось.','Carrying a burden on the heart.','To experience emotional suffering for someone.'),
	 ('English','Broken heart','If someone upsets you greatly, they break your heart, especially if they end a relationship.','n/a','n/a'),
	 ('Swedish','Bli varm om hjärtat','Bli glad eller rörd; känna starkt för någon.','To be warm to the heart','To feel moved or touched by something.'),
	 ('Ukrainian','Покласти руку на серце','Щиро, відверто.','To put your hand on your heart','To be honest and sincere.'),
	 ('Swedish','Ha ett brustet hjärta','Vara mycket olycklig; ha ett krossat hjärta.','To have a broken heart.','To be very unhappy caused by the ending of a romantic relationship or the death of a loved one');
