# Verslag Datavisualisatie: Groep 5

## Onderzoeksvraag

We willen te weten komen of er een impact is op natuurrampen door de opwarming van de aarde (klimaatverandering). We kunnen dit op verschillende manieren doen:
- Is er een toename in het aantal natuurrampen?
- Is er een toename in het aantal doden?
- Worden natuurrampen krachtiger? Merken we aan aardbevingen dat deze een hogere waarde hebben op de schaal van richter? Staat meer gebied onder water bij overstromingen?

## Dataset

We gebruiken de [EM-DAT dataset](https://www.emdat.be/). Dit is de dataset van een organisatie die zich sinds 1988 bezig houdt met het verzamelen en raporteren van alle rampen. Dit zijn zowel natuurlijke als onnatuurlijke (technologische) rampen. 
Over deze data worden er verschillende eigenschappen bijgehouden: het type van de ramp, welke regio(/land), de start & einddatum, het aantal doden/gewonden/getroffen personen, de schade (prijs), de magnitude, etc.. 
Over alle rampen is niet alle info beschikbaar, het is dus zo dat het mogelijk is dat het aantal doden niet gekend is of de specifieke begin - en einddatum van de ramp.

Aangezien onze onderzoeksvraag gaat over natuurrampen filteren we de onnatuurlijke rampen uit deze dataset weg. 

EM-DAT stelt ook dat het dataset onderhevig is aan tijdsbias. Dit betekent dat het dataset lijdt aan ongelijke rapportagekwaliteit en dekkingsgraad in de loop van de tijd. We kunnen deze bias verminderen door het dataset te filteren om alleen gegevens na het jaar 1988 op te nemen.

## Roadmap

Om een goed beeld te krijgen van welke data beschikbaar was in de dataset doorzochten we deze eerst goed. Hier waren enkele initiële ideeën uit ontstaan:
1. Epidemieën en ziektes worden ook in de dataset gecategorieseerd als natuurramp, deze worden weg gefilterd.
2. We merken dat er een bias kan zijn in de rapportering van enkele waardes van deze natuurramp (bv. aantal doden). Hier moeten we rekening mee houden.
3. De magnitude van rampen is een initiële indicator van hoe zwaar deze natuurramp is. We gaan dus ook moeten kijken naar andere indicatoren dan enkel de magnitude kolom in de dataset. Voor sommige natuurrampen is er weinig/tot geen informatie bijvoorbeeld mist en vulkanische activiteit.

Na deze initiële inspectie van de dataset besloten we ons the focussen op deze 7 natuurrampen: **overstromingen, stormen, aardbevingen, aardverschuivingen, droogtes, extreme temperaturen en branden**.

## Grafieken
### Sunburst
Om een idee te geven hoe onze dataset eruit ziet hadden we 1 centrale grafiek nodig. We hadden een grafiek nodig die de Types en Subtypes duidelijk toonde. Uiteindelijk hebben we gekozen voor de sunburst grafiek. De eerst implementatie is hieronder te zien. Op deze manier konden we de verschillende natuurrampen weergeven en het aandeel van elke natuuramp in de dataset. Om de defenitie van elk type weer te geven hebben we de definities van EM-DAT genomen en een feature toegevoegd waar de definities getoond worden als je over het type in de graph hovered.

![Sunburst, eerste implementatie](/Assets/Selection_015.png)

We kregen hier wel het probleem dat een aantal subtypes een veel te klein aandeel hadden om deze duidelijk te weergeven in de sunburst.

![Sunburst, te klein aandeel](/Assets/Selection_016.png)

Dit hebben we uiteindelijk opgelost door een categorie: other te maken en de subtypes met een te klein aandeel in deze categorie te zetten.

![Sunburst, Final](/Assets/Selection_014.png)

We hadden ook gekeken naar de TreeMap grafiek om onze dataset weer te geven maar vonden dat deze onduidelijker was dan de sunburst.
![Sunburst, TreeMap](/Assets/image.png)


### Trend area chart
De area chart was een van de eerste grafieken die we hadden gemaakt, deze geeft de trend weer van iedere disaster type en de totale trend van alle disasters samen.

![Area chart](/Assets/area-chart.png)

### Death toll bar chart

![Death tolls bar chart](/Assets/Death-tolls.png)

### Deadlliest disasters

![alt text](/Assets/Deadliest_all.png)

### Correlatie met temperature
Om de correlatie tussen de opwarming van de aarde en het aantal disasters te bekijken hadden we eerst het idee om een line chart te nemen van de temperatuur en deze naast de trend are chart te zetten. het resultaat was de grafiek hieronder.

![temp line](/Assets/temp_line.png)

We hadden door dat het vrij moeilijk was om de trends objectief met elkaar te kunnen vergelijken. Het idee was een nieuwe graph te maken met beide de trend van het aantal disasters en de temperatuur anomaly. Het resultaat is hieronder te zien. Om de correlatie minder subjectief te maken hebben we ook een correlatie-factor in de graph geplaatst.

![Correlation with temperature](/Assets/corr_all.png)

## Grafieken niet in het resultaat
### Correlatie matrix
