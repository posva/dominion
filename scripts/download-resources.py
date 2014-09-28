#! /usr/bin/env python3

import urllib.request, sys, os, re, time
from threading import Thread, active_count

def warn(s):
    print('[1;33mWARN:[0m', s)
def err(s):
    print('[1;31mERR:[0m', s)
def info(s):
    print('[1;34mINFO:[0m', s)

domain = 'https://www.playdominion.com/Dominion/'
main_dir = 'img/'
dir_assoc = {
    'CardBuilder/img/back': 'card/layout/',
    'CardBuilder/img/frame': 'card/layout/',
    'CardBuilder/img/icon': 'set/',
    'CardBuilder/img/illustration': 'card/',
    'img': '',
}
downs = {
# back layout
    'CardBuilder/img/back/main-full.png': 'main-full.png',
    'CardBuilder/img/back/main-half.png': 'main-half.png',

# cards layout
    'CardBuilder/img/frame/action-attack-full.png': 'action-attack-full.png',
    'CardBuilder/img/frame/action-attack-half.png': 'action-attack-half.png',
    'CardBuilder/img/frame/action-duration-full.png': 'action-duration-full.png',
    'CardBuilder/img/frame/action-duration-half.png': 'action-duration-half.png',
    'CardBuilder/img/frame/action-full.png': 'action-full.png',
    'CardBuilder/img/frame/action-half.png': 'action-half.png',
    'CardBuilder/img/frame/action-potioncoin-full.png': 'action-potioncoin-full.png',
    'CardBuilder/img/frame/action-potioncoin-half.png': 'action-potioncoin-half.png',
    'CardBuilder/img/frame/action-potion-full.png': 'action-potion-full.png',
    'CardBuilder/img/frame/action-potion-half.png': 'action-potion-half.png',
    'CardBuilder/img/frame/action-reaction-full.png': 'action-reaction-full.png',
    'CardBuilder/img/frame/action-reaction-half.png': 'action-reaction-half.png',
    'CardBuilder/img/frame/action-victory-full.png': 'action-victory-full.png',
    'CardBuilder/img/frame/action-victory-half.png': 'action-victory-half.png',
    'CardBuilder/img/frame/curse-full.png': 'curse-full.png',
    'CardBuilder/img/frame/curse-half.png': 'curse-half.png',
    'CardBuilder/img/frame/treasure-full.png': 'treasure-full.png',
    'CardBuilder/img/frame/treasure-half.png': 'treasure-half.png',
    'CardBuilder/img/frame/treasureillustrated-full.png': 'treasureillustrated-full.png',
    'CardBuilder/img/frame/treasureillustrated-half.png': 'treasureillustrated-half.png',
    'CardBuilder/img/frame/treasure-philosopher-full.png': 'treasure-philosopher-full.png',
    'CardBuilder/img/frame/treasure-philosopher-half.png': 'treasure-philosopher-half.png',
    'CardBuilder/img/frame/treasure-potion-full.png': 'treasure-potion-full.png',
    'CardBuilder/img/frame/treasure-potion-half.png': 'treasure-potion-half.png',
    'CardBuilder/img/frame/treasure-reaction-full.png': 'treasure-reaction-full.png',
    'CardBuilder/img/frame/treasure-reaction-half.png': 'treasure-reaction-half.png',
    'CardBuilder/img/frame/treasure-victory-full.png': 'treasure-victory-full.png',
    'CardBuilder/img/frame/treasure-victory-half.png': 'treasure-victory-half.png',
    'CardBuilder/img/frame/victory-full.png': 'victory-full.png',
    'CardBuilder/img/frame/victory-half.png': 'victory-half.png',
    'CardBuilder/img/frame/victoryillustrated-full.png': 'victoryillustrated-full.png',
    'CardBuilder/img/frame/victoryillustrated-half.png': 'victoryillustrated-half.png',
    'CardBuilder/img/frame/victory-potion-full.png': 'victory-potion-full.png',
    'CardBuilder/img/frame/victory-potion-half.png': 'victory-potion-half.png',
    'CardBuilder/img/frame/victory-reaction-full.png': 'victory-reaction-full.png',
    'CardBuilder/img/frame/victory-reaction-half.png': 'victory-reaction-half.png',

# sets icons
    'CardBuilder/img/icon/alchemy.png': 'alchemy.png',
    'CardBuilder/img/icon/baseSet.png': 'baseSet.png',
    'CardBuilder/img/icon/cornucopia.png': 'cornucopia.png',
    'CardBuilder/img/icon/darkAges-KnightsAndKnaves.png': 'darkAges.png',
    'CardBuilder/img/icon/guilds.png': 'guilds.png',
    'CardBuilder/img/icon/hinterlands-FarawayLands.png': 'hinterlands.png',
    'CardBuilder/img/icon/intrigue-PeasantsAndAristocrats.png': 'intrigue.png',
    'CardBuilder/img/icon/promo-BlackMarket.png': 'promo-BlackMarket.png',
    'CardBuilder/img/icon/promo-Envoy.png': 'promo-Envoy.png',
    'CardBuilder/img/icon/promo-Governor.png': 'promo-Governor.png',
    'CardBuilder/img/icon/promo-Prince.png': 'promo-Prince.png',
    'CardBuilder/img/icon/promo-Stash.png': 'promo-Stash.png',
    'CardBuilder/img/icon/promo-WalledVillage.png': 'promo-WalledVillage.png',
    'CardBuilder/img/icon/prosperity-BiggerAndBetter.png': 'prosperity.png',
    'CardBuilder/img/icon/seaside-PortsAndBeaches.png': 'seaside.png',

# illustrations
    'CardBuilder/img/illustration/advisor.jpg': 'advisor.jpg',
    'CardBuilder/img/illustration/alchemist.jpg': 'alchemist.jpg',
    'CardBuilder/img/illustration/altar.jpg': 'altar.jpg',
    'CardBuilder/img/illustration/ambassador.jpg': 'ambassador.jpg',
    'CardBuilder/img/illustration/apothecary.jpg': 'apothecary.jpg',
    'CardBuilder/img/illustration/apprentice.jpg': 'apprentice.jpg',
    'CardBuilder/img/illustration/armory.jpg': 'armory.jpg',
    'CardBuilder/img/illustration/bagOfGold.jpg': 'bagOfGold.jpg',
    'CardBuilder/img/illustration/baker.jpg': 'baker.jpg',
    'CardBuilder/img/illustration/banditCamp.jpg': 'banditCamp.jpg',
    'CardBuilder/img/illustration/bandOfMisfits.jpg': 'bandOfMisfits.jpg',
    'CardBuilder/img/illustration/bank.jpg': 'bank.jpg',
    'CardBuilder/img/illustration/baron.jpg': 'baron.jpg',
    'CardBuilder/img/illustration/bazaar.jpg': 'bazaar.jpg',
    'CardBuilder/img/illustration/beggar.jpg': 'beggar.jpg',
    'CardBuilder/img/illustration/bishop.jpg': 'bishop.jpg',
    'CardBuilder/img/illustration/blackMarket.jpg': 'blackMarket.jpg',
    'CardBuilder/img/illustration/borderVillage.jpg': 'borderVillage.jpg',
    'CardBuilder/img/illustration/bridge.jpg': 'bridge.jpg',
    'CardBuilder/img/illustration/butcher.jpg': 'butcher.jpg',
    'CardBuilder/img/illustration/cache.jpg': 'cache.jpg',
    'CardBuilder/img/illustration/candlestickMaker.jpg': 'candlestickMaker.jpg',
    'CardBuilder/img/illustration/caravan.jpg': 'caravan.jpg',
    'CardBuilder/img/illustration/cartographer.jpg': 'cartographer.jpg',
    'CardBuilder/img/illustration/catacombs.jpg': 'catacombs.jpg',
    'CardBuilder/img/illustration/chapel.jpg': 'chapel.jpg',
    'CardBuilder/img/illustration/city.jpg': 'city.jpg',
    'CardBuilder/img/illustration/conspirator.jpg': 'conspirator.jpg',
    'CardBuilder/img/illustration/contraband.jpg': 'contraband.jpg',
    'CardBuilder/img/illustration/coppersmith.jpg': 'coppersmith.jpg',
    'CardBuilder/img/illustration/councilRoom.jpg': 'councilRoom.jpg',
    'CardBuilder/img/illustration/counterfeit.jpg': 'counterfeit.jpg',
    'CardBuilder/img/illustration/countingHouse.jpg': 'countingHouse.jpg',
    'CardBuilder/img/illustration/count.jpg': 'count.jpg',
    'CardBuilder/img/illustration/courtyard.jpg': 'courtyard.jpg',
    'CardBuilder/img/illustration/crossroads.jpg': 'crossroads.jpg',
    'CardBuilder/img/illustration/cultist.jpg': 'cultist.jpg',
    'CardBuilder/img/illustration/cutpurse.jpg': 'cutpurse.jpg',
    'CardBuilder/img/illustration/deathCart.jpg': 'deathCart.jpg',
    'CardBuilder/img/illustration/develop.jpg': 'develop.jpg',
    'CardBuilder/img/illustration/diadem.jpg': 'diadem.jpg',
    'CardBuilder/img/illustration/doctor.jpg': 'doctor.jpg',
    'CardBuilder/img/illustration/duchess.jpg': 'duchess.jpg',
    'CardBuilder/img/illustration/duke.jpg': 'duke.jpg',
    'CardBuilder/img/illustration/embargo.jpg': 'embargo.jpg',
    'CardBuilder/img/illustration/embassy.jpg': 'embassy.jpg',
    'CardBuilder/img/illustration/envoy.jpg': 'envoy.jpg',
    'CardBuilder/img/illustration/expand.jpg': 'expand.jpg',
    'CardBuilder/img/illustration/explorer.jpg': 'explorer.jpg',
    'CardBuilder/img/illustration/fairgrounds.jpg': 'fairgrounds.jpg',
    'CardBuilder/img/illustration/familiar.jpg': 'familiar.jpg',
    'CardBuilder/img/illustration/farmingVillage.jpg': 'farmingVillage.jpg',
    'CardBuilder/img/illustration/farmland.jpg': 'farmland.jpg',
    'CardBuilder/img/illustration/feast.jpg': 'feast.jpg',
    'CardBuilder/img/illustration/feodum.jpg': 'feodum.jpg',
    'CardBuilder/img/illustration/fishingVillage.jpg': 'fishingVillage.jpg',
    'CardBuilder/img/illustration/followers.jpg': 'followers.jpg',
    'CardBuilder/img/illustration/foolsGold.jpg': 'foolsGold.jpg',
    'CardBuilder/img/illustration/forager.jpg': 'forager.jpg',
    'CardBuilder/img/illustration/forge.jpg': 'forge.jpg',
    'CardBuilder/img/illustration/fortress.jpg': 'fortress.jpg',
    'CardBuilder/img/illustration/fortuneTeller.jpg': 'fortuneTeller.jpg',
    'CardBuilder/img/illustration/gardens.jpg': 'gardens.jpg',
    'CardBuilder/img/illustration/ghostShip.jpg': 'ghostShip.jpg',
    'CardBuilder/img/illustration/golem.jpg': 'golem.jpg',
    'CardBuilder/img/illustration/goons.jpg': 'goons.jpg',
    'CardBuilder/img/illustration/governor.jpg': 'governor.jpg',
    'CardBuilder/img/illustration/grandMarket.jpg': 'grandMarket.jpg',
    'CardBuilder/img/illustration/graverobber.jpg': 'graverobber.jpg',
    'CardBuilder/img/illustration/greatHall.jpg': 'greatHall.jpg',
    'CardBuilder/img/illustration/haggler.jpg': 'haggler.jpg',
    'CardBuilder/img/illustration/hamlet.jpg': 'hamlet.jpg',
    'CardBuilder/img/illustration/harem.jpg': 'harem.jpg',
    'CardBuilder/img/illustration/harvest.jpg': 'harvest.jpg',
    'CardBuilder/img/illustration/haven.jpg': 'haven.jpg',
    'CardBuilder/img/illustration/herald.jpg': 'herald.jpg',
    'CardBuilder/img/illustration/herbalist.jpg': 'herbalist.jpg',
    'CardBuilder/img/illustration/hermit.jpg': 'hermit.jpg',
    'CardBuilder/img/illustration/highway.jpg': 'highway.jpg',
    'CardBuilder/img/illustration/hoard.jpg': 'hoard.jpg',
    'CardBuilder/img/illustration/hornOfPlenty.jpg': 'hornOfPlenty.jpg',
    'CardBuilder/img/illustration/horseTraders.jpg': 'horseTraders.jpg',
    'CardBuilder/img/illustration/huntingGrounds.jpg': 'huntingGrounds.jpg',
    'CardBuilder/img/illustration/huntingParty.jpg': 'huntingParty.jpg',
    'CardBuilder/img/illustration/illGottenGains.jpg': 'illGottenGains.jpg',
    'CardBuilder/img/illustration/inn.jpg': 'inn.jpg',
    'CardBuilder/img/illustration/ironmonger.jpg': 'ironmonger.jpg',
    'CardBuilder/img/illustration/ironworks.jpg': 'ironworks.jpg',
    'CardBuilder/img/illustration/island.jpg': 'island.jpg',
    'CardBuilder/img/illustration/jackOfAllTrades.jpg': 'jackOfAllTrades.jpg',
    'CardBuilder/img/illustration/jester.jpg': 'jester.jpg',
    'CardBuilder/img/illustration/journeyman.jpg': 'journeyman.jpg',
    'CardBuilder/img/illustration/junkDealer.jpg': 'junkDealer.jpg',
    'CardBuilder/img/illustration/kingsCourt.jpg': 'kingsCourt.jpg',
    'CardBuilder/img/illustration/knights.jpg': 'knights.jpg',
    'CardBuilder/img/illustration/lighthouse.jpg': 'lighthouse.jpg',
    'CardBuilder/img/illustration/loan.jpg': 'loan.jpg',
    'CardBuilder/img/illustration/lookout.jpg': 'lookout.jpg',
    'CardBuilder/img/illustration/mandarin.jpg': 'mandarin.jpg',
    'CardBuilder/img/illustration/marauder.jpg': 'marauder.jpg',
    'CardBuilder/img/illustration/margrave.jpg': 'margrave.jpg',
    'CardBuilder/img/illustration/market.jpg': 'market.jpg',
    'CardBuilder/img/illustration/marketSquare.jpg': 'marketSquare.jpg',
    'CardBuilder/img/illustration/masquerade.jpg': 'masquerade.jpg',
    'CardBuilder/img/illustration/masterpiece.jpg': 'masterpiece.jpg',
    'CardBuilder/img/illustration/menagerie.jpg': 'menagerie.jpg',
    'CardBuilder/img/illustration/merchantGuild.jpg': 'merchantGuild.jpg',
    'CardBuilder/img/illustration/merchantShip.jpg': 'merchantShip.jpg',
    'CardBuilder/img/illustration/mine.jpg': 'mine.jpg',
    'CardBuilder/img/illustration/miningVillage.jpg': 'miningVillage.jpg',
    'CardBuilder/img/illustration/minion.jpg': 'minion.jpg',
    'CardBuilder/img/illustration/mint.jpg': 'mint.jpg',
    'CardBuilder/img/illustration/monument.jpg': 'monument.jpg',
    'CardBuilder/img/illustration/mountebank.jpg': 'mountebank.jpg',
    'CardBuilder/img/illustration/mystic.jpg': 'mystic.jpg',
    'CardBuilder/img/illustration/nativeVillage.jpg': 'nativeVillage.jpg',
    'CardBuilder/img/illustration/navigator.jpg': 'navigator.jpg',
    'CardBuilder/img/illustration/nobleBrigand.jpg': 'nobleBrigand.jpg',
    'CardBuilder/img/illustration/nobles.jpg': 'nobles.jpg',
    'CardBuilder/img/illustration/nomadCamp.jpg': 'nomadCamp.jpg',
    'CardBuilder/img/illustration/oasis.jpg': 'oasis.jpg',
    'CardBuilder/img/illustration/oracle.jpg': 'oracle.jpg',
    'CardBuilder/img/illustration/outpost.jpg': 'outpost.jpg',
    'CardBuilder/img/illustration/pawn.jpg': 'pawn.jpg',
    'CardBuilder/img/illustration/pearlDiver.jpg': 'pearlDiver.jpg',
    'CardBuilder/img/illustration/peddler.jpg': 'peddler.jpg',
    'CardBuilder/img/illustration/philosophersStone.jpg': 'philosophersStone.jpg',
    'CardBuilder/img/illustration/pillage.jpg': 'pillage.jpg',
    'CardBuilder/img/illustration/pirateShip.jpg': 'pirateShip.jpg',
    'CardBuilder/img/illustration/plaza.jpg': 'plaza.jpg',
    'CardBuilder/img/illustration/poorHouse.jpg': 'poorHouse.jpg',
    'CardBuilder/img/illustration/possession.jpg': 'possession.jpg',
    'CardBuilder/img/illustration/prince.jpg': 'prince.jpg',
    'CardBuilder/img/illustration/princess.jpg': 'princess.jpg',
    'CardBuilder/img/illustration/procession.jpg': 'procession.jpg',
    'CardBuilder/img/illustration/quarry.jpg': 'quarry.jpg',
    'CardBuilder/img/illustration/rabble.jpg': 'rabble.jpg',
    'CardBuilder/img/illustration/rats.jpg': 'rats.jpg',
    'CardBuilder/img/illustration/rebuild.jpg': 'rebuild.jpg',
    'CardBuilder/img/illustration/remake.jpg': 'remake.jpg',
    'CardBuilder/img/illustration/rogue.jpg': 'rogue.jpg',
    'CardBuilder/img/illustration/royalSeal.jpg': 'royalSeal.jpg',
    'CardBuilder/img/illustration/saboteur.jpg': 'saboteur.jpg',
    'CardBuilder/img/illustration/sage.jpg': 'sage.jpg',
    'CardBuilder/img/illustration/salvager.jpg': 'salvager.jpg',
    'CardBuilder/img/illustration/scavenger.jpg': 'scavenger.jpg',
    'CardBuilder/img/illustration/scheme.jpg': 'scheme.jpg',
    'CardBuilder/img/illustration/scout.jpg': 'scout.jpg',
    'CardBuilder/img/illustration/scryingPool.jpg': 'scryingPool.jpg',
    'CardBuilder/img/illustration/seaHag.jpg': 'seaHag.jpg',
    'CardBuilder/img/illustration/secretChamber.jpg': 'secretChamber.jpg',
    'CardBuilder/img/illustration/shantyTown.jpg': 'shantyTown.jpg',
    'CardBuilder/img/illustration/silkRoad.jpg': 'silkRoad.jpg',
    'CardBuilder/img/illustration/smithy.jpg': 'smithy.jpg',
    'CardBuilder/img/illustration/smugglers.jpg': 'smugglers.jpg',
    'CardBuilder/img/illustration/soothsayer.jpg': 'soothsayer.jpg',
    'CardBuilder/img/illustration/spiceMerchant.jpg': 'spiceMerchant.jpg',
    'CardBuilder/img/illustration/spy.jpg': 'spy.jpg',
    'CardBuilder/img/illustration/squire.jpg': 'squire.jpg',
    'CardBuilder/img/illustration/stables.jpg': 'stables.jpg',
    'CardBuilder/img/illustration/stash.jpg': 'stash.jpg',
    'CardBuilder/img/illustration/steward.jpg': 'steward.jpg',
    'CardBuilder/img/illustration/stonemason.jpg': 'stonemason.jpg',
    'CardBuilder/img/illustration/storeroom.jpg': 'storeroom.jpg',
    'CardBuilder/img/illustration/swindler.jpg': 'swindler.jpg',
    'CardBuilder/img/illustration/tactician.jpg': 'tactician.jpg',
    'CardBuilder/img/illustration/talisman.jpg': 'talisman.jpg',
    'CardBuilder/img/illustration/taxman.jpg': 'taxman.jpg',
    'CardBuilder/img/illustration/torturer.jpg': 'torturer.jpg',
    'CardBuilder/img/illustration/tournament.jpg': 'tournament.jpg',
    'CardBuilder/img/illustration/trader.jpg': 'trader.jpg',
    'CardBuilder/img/illustration/tradeRoute.jpg': 'tradeRoute.jpg',
    'CardBuilder/img/illustration/tradingPost.jpg': 'tradingPost.jpg',
    'CardBuilder/img/illustration/transmute.jpg': 'transmute.jpg',
    'CardBuilder/img/illustration/treasureMap.jpg': 'treasureMap.jpg',
    'CardBuilder/img/illustration/treasury.jpg': 'treasury.jpg',
    'CardBuilder/img/illustration/tribute.jpg': 'tribute.jpg',
    'CardBuilder/img/illustration/trustySteed.jpg': 'trustySteed.jpg',
    'CardBuilder/img/illustration/tunnel.jpg': 'tunnel.jpg',
    'CardBuilder/img/illustration/university.jpg': 'university.jpg',
    'CardBuilder/img/illustration/upgrade.jpg': 'upgrade.jpg',
    'CardBuilder/img/illustration/urchin.jpg': 'urchin.jpg',
    'CardBuilder/img/illustration/vagrant.jpg': 'vagrant.jpg',
    'CardBuilder/img/illustration/vault.jpg': 'vault.jpg',
    'CardBuilder/img/illustration/venture.jpg': 'venture.jpg',
    'CardBuilder/img/illustration/village.jpg': 'village.jpg',
    'CardBuilder/img/illustration/vineyard.jpg': 'vineyard.jpg',
    'CardBuilder/img/illustration/walledVillage.jpg': 'walledVillage.jpg',
    'CardBuilder/img/illustration/wanderingMinstrel.jpg': 'wanderingMinstrel.jpg',
    'CardBuilder/img/illustration/warehouse.jpg': 'warehouse.jpg',
    'CardBuilder/img/illustration/watchtower.jpg': 'watchtower.jpg',
    'CardBuilder/img/illustration/wharf.jpg': 'wharf.jpg',
    'CardBuilder/img/illustration/wishingWell.jpg': 'wishingWell.jpg',
    'CardBuilder/img/illustration/witch.jpg': 'witch.jpg',
    'CardBuilder/img/illustration/workersVillage.jpg': 'workersVillage.jpg',
    'CardBuilder/img/illustration/youngWitch.jpg': 'youngWitch.jpg',
    'img/large_trash.png': 'card/trash.png',

#

}

# check for the directory
def check_place():
    cwd = os.getcwd()
    if not re.match('.*dominion/?$', cwd):
        if re.match('.*scripts/?$', cwd):
            info('Moving out of scripts dir')
            os.chdir('..')
        else:
            err('You should launch the script at the root of the project, however it\'s being launched from '+cwd)
            sys.exit(1)

errors = 0
def download(k):
    global downs, domain, main_dir, dir_assoc, errors
    d = downs[k]
    url = domain+k;
    fi = main_dir+dir_assoc[os.path.dirname(k)]+d
    if os.path.isfile(fi):
        info('Skiping '+fi+' (already exists)')
        return
    info('Downloading '+url+' to '+fi+'...')
    try:
        urllib.request.urlretrieve(url, fi)
    except:
        err('couldn\'t download')
        errors += 1
        raise

check_place()
# create the needed dirs
for k in dir_assoc:
    d = main_dir+dir_assoc[k]
    info('Creating dir '+d)
    os.makedirs(d, exist_ok=True)

for k in downs:
    while active_count() > 6:
        time.sleep(0.5)
    thread = Thread(target = download, args = (k,))
    thread.start()

info('Waiting for threads...')
while active_count() > 1:
    time.sleep(0.5)

if errors > 0:
    warn('Errors ocurred, check the log')
