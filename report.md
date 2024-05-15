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

## Roadmap

Om een goed beeld te krijgen van welke data beschikbaar was in de dataset doorzochten we deze eerst goed. Hier waren enkele initiële ideeën uit ontstaan:
1. Epidemieën en ziektes worden ook in de dataset gecategorieseerd als natuurramp, deze worden weg gefilterd.
2. We merken dat er een bias kan zijn in de rapportering van enkele waardes van deze natuurramp (bv. aantal doden). Hier moeten we rekening mee houden.
3. De magnitude van rampen is een initiële indicator van hoe zwaar deze natuurramp is. We gaan dus ook moeten kijken naar andere indicatoren dan enkel de magnitude kolom in de dataset. Voor sommige natuurrampen is er weinig/tot geen informatie bijvoorbeeld mist en vulkanische activiteit.

Na deze initiële inspectie van de dataset besloten we ons the focussen op deze 7 natuurrampen: **overstromingen, stormen, aardbevingen, aardverschuivingen, droogtes, extreme temperaturen en branden**.






