// 100 AI Player Profiles with personalities, avatars, and trash talk

import { getTrendingNames, isTrendingEnabled } from './trendingNames';

// Get trending names for profiles
function getTrendingNamesForProfiles(count: number): string[] {
  if (!isTrendingEnabled()) return [];
  return getTrendingNames(count);
}

export interface AIProfile {
  id: string;
  name: string;
  personality: 'aggressive' | 'conservative' | 'random' | 'tricky';
  avatar: string; // emoji
  catchphrase: string;
  trashTalk: {
    onGoodHand: string[];
    onBadHand: string[];
    onWin: string[];
    onLose: string[];
    onHold: string[];
    onDrop: string[];
    idle: string[];
  };
  gamesPlayed: number;
  heartsReceived: number;
}

// Generate 100 unique profiles
export const AI_PROFILES: AIProfile[] = [
  // Aggressive players (25)
  { id: 'ag1', name: 'Blaze', personality: 'aggressive', avatar: '🔥', catchphrase: "Let's burn!", trashTalk: { onGoodHand: ["This hand is FIRE!\nYou're already toast.\nBetter run! 🔥", "Easy money coming.\nI can smell the fear.\nYou're DONE!"], onBadHand: ["Doesn't matter.\nI run hot anyway!\nWatch me bluff!", "Bad cards? HA!\nI make my own luck.\nDare to challenge?"], onWin: ["BURNED! 🔥🔥🔥\nToo easy!\nPay up loser!", "Blaze wins AGAIN!\nDid you really think...\nYou could beat fire?!"], onLose: ["Lucky shot...\nEnjoy it while it lasts.\nI'll get you next!", "Fluke win.\nThe fire never dies.\nYou'll regret that!"], onHold: ["ALL IN BABY!\nFeel the HEAT! 🔥\nNo fear here!", "Let's GO!\nBurning hot!\nCan't touch this!"], onDrop: ["Strategic retreat.\nSaving my flames.\nI'll be back HOTTER!"], idle: ["Tap my ❤️!\nI'm the hottest player!\nLove me or burn! 🔥", "Still watching?\nHit that heart!\nJoin team BLAZE!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag2', name: 'Spike', personality: 'aggressive', avatar: '⚡', catchphrase: "Shock and awe", trashTalk: { onGoodHand: ["SHOCKING hand!\nYou're not ready.\nPrepare to fry! ⚡", "Electrifying draw!\nVoltage is HIGH.\nYou're gonna feel this!"], onBadHand: ["Still dangerous.\nLow voltage? Please.\nI surge when needed!", "Don't test me.\nEven weak sparks...\nCan start wildfires!"], onWin: ["ZAPPED! ⚡⚡⚡\nFelt that shock?!\nSpike DOMINATES!", "ELECTROCUTED!\nNever doubt me.\nI am the STORM!"], onLose: ["Recharging...\nYou got lucky.\nLightning strikes twice!", "Minor setback.\nPower building.\nBigger shock coming!"], onHold: ["FULL POWER!\nSURGE MODE! ⚡\nBrace yourself!", "Maximum voltage!\nShock incoming!\nYou can't escape!"], onDrop: ["Saving energy.\nFor the BIG strike.\nYou'll see!"], idle: ["Hit that ❤️!\nFeel my energy! ⚡\nBe electrified!", "Love Spike!\nI'm pure electricity.\nJoin the current!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag3', name: 'Crusher', personality: 'aggressive', avatar: '💪', catchphrase: "Crush them all", trashTalk: { onGoodHand: ["HULK SMASH!\nThis hand DESTROYS.\nYou're done! 💪", "Crushing it!\nPure power play.\nNo escape for you!"], onBadHand: ["Still STRONGER\nthan your best hand.\nMuscle through!", "Bad cards?\nI never quit.\nStrength finds a way!"], onWin: ["DEMOLISHED! 💪💪💪\nToo weak!\nWho's next?!", "CRUSHED you!\nAbsolute destruction.\nFear the muscle!"], onLose: ["IMPOSSIBLE!\nMust be cheating.\nI demand rematch!", "Fluke win.\nEnjoy it.\nCrusher remembers!"], onHold: ["CRUSH MODE!\nNo mercy today! 💪\nBring the PAIN!", "Holding STRONG!\nUnbreakable.\nTry to stop me!"], onDrop: ["Tactical retreat.\nResting muscles.\nTo crush HARDER!"], idle: ["❤️ the CRUSHER!\nFeel these gains! 💪\nPure MUSCLE!", "Love me!\nI protect my fans.\nJoin the strong!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag4', name: 'Viper', personality: 'aggressive', avatar: '🐍', catchphrase: "Sssstrike!", trashTalk: { onGoodHand: ["Venomous hand!\nYou're already dead.\nNo antidote! 🐍", "Deadly draw.\nFangs are ready.\nSay goodbye!"], onBadHand: ["Still got FANGS.\nWaiting to strike.\nYou won't see it!", "Coiled and ready.\nBad hand? Doesn't matter.\nVenom kills!"], onWin: ["BITTEN! 🐍🐍🐍\nFeel that venom?!\nViper WINS!", "Toxic victory!\nYou're poisoned.\nNever had a chance!"], onLose: ["Shedding skin.\nI'll be back deadlier.\nWatch your step!", "Lucky escape.\nNext time...\nYou're DONE!"], onHold: ["STRIKE TIME!\nHsssss! 🐍\nFangs OUT!", "Ready to bite!\nNo mercy.\nVenom flows!"], onDrop: ["Coiling back.\nFor deadly strike.\nPatience..."], idle: ["Love the Viper! 🐍\nI don't bite fans.\nTap that ❤️!", "Show some love!\nOr face my fangs.\nYour choice!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag5', name: 'Rocket', personality: 'aggressive', avatar: '🚀', catchphrase: "To the moon!", trashTalk: { onGoodHand: ["LIFTOFF incoming!\nStellar hand! 🚀\nYou can't catch me!", "Launching victory!\nTrajectory: WINNING.\nPrepare for impact!"], onBadHand: ["Recalculating orbit.\nStill gonna win!\nRockets adapt!", "Boosters charging.\nWatch this launch.\nBad cards? Irrelevant!"], onWin: ["LAUNCHED! 🚀🚀🚀\nTo the MOON!\nRocket WINS!", "Orbit achieved!\nMission complete.\nYou got LAUNCHED!"], onLose: ["Minor turbulence.\nRe-entry time.\nI'll orbit back!", "Space debris.\nTemporary setback.\nNext launch is mine!"], onHold: ["BLAST OFF!\nFull throttle! 🚀\n3...2...1...LAUNCH!", "No stopping me!\nEngines FIRING.\nTo infinity!"], onDrop: ["Abort mission.\nSaving fuel.\nBigger launch coming!"], idle: ["❤️ Rocket!\nJoin my crew! 🚀\nFly with me!", "Tap that heart!\nBe an astronaut.\nWe're going UP!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag6', name: 'Tank', personality: 'aggressive', avatar: '🪖', catchphrase: "Rolling in", trashTalk: { onGoodHand: ["LOADED and ready!\nHeavy artillery! 🪖\nYou're the target!", "Armor PIERCING rounds!\nLocked and loaded.\nSay your prayers!"], onBadHand: ["Armor up!\nI can take hits.\nTanks don't stop!", "Keep rolling!\nBad ammo? Please.\nI'll crush you anyway!"], onWin: ["DESTROYED! 🪖🪖🪖\nBOOM! Enemy down!\nTank DOMINATES!", "SHELLED!\nTotal annihilation.\nWho's next?!"], onLose: ["Minor damage.\nRepairing systems.\nI'll be back!", "Tactical retreat.\nBut tanks return.\nStronger than ever!"], onHold: ["FIRE ALL CANNONS!\nCharge forward! 🪖\nNo surrender!", "Rolling in HOT!\nMaximum firepower.\nBrace for impact!"], onDrop: ["Fall back.\nReloading ammo.\nBigger assault coming!"], idle: ["Love the Tank! 🪖\nJoin my battalion!\nWe roll together!", "Tap ❤️ soldier!\nTarget acquired.\nBe on my team!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag7', name: 'Storm', personality: 'aggressive', avatar: '⛈️', catchphrase: "Thunder coming", trashTalk: { onGoodHand: ["Lightning!", "Stormy!"], onBadHand: ["Brewing", "Clouds gathering"], onWin: ["STRUCK!", "Flooded!"], onLose: ["Passing storm", "Drizzle"], onHold: ["THUNDER!", "Downpour!"], onDrop: ["Clearing up"], idle: ["*thunder*", "Dark clouds..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag8', name: 'Fang', personality: 'aggressive', avatar: '🦷', catchphrase: "Bite hard", trashTalk: { onGoodHand: ["Sharp!", "Toothy grin"], onBadHand: ["Still got bite", "Gnashing"], onWin: ["CHOMPED!", "Devoured!"], onLose: ["Chipped", "Overbite"], onHold: ["BITE!", "Chomp!"], onDrop: ["Jaw rest"], idle: ["*gnash*", "Hungry..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag9', name: 'Blitz', personality: 'aggressive', avatar: '💥', catchphrase: "Blitz attack!", trashTalk: { onGoodHand: ["Explosive!", "Boom time"], onBadHand: ["Fuse lit", "Ticking"], onWin: ["KABOOM!", "Exploded!"], onLose: ["Dud", "Misfire"], onHold: ["DETONATE!", "Fire in hole!"], onDrop: ["Defusing"], idle: ["Tick tick...", "*beep*"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag10', name: 'Havoc', personality: 'aggressive', avatar: '🌪️', catchphrase: "Chaos reigns", trashTalk: { onGoodHand: ["Chaotic good!", "Mayhem!"], onBadHand: ["Stirring up", "Turbulent"], onWin: ["DESTROYED!", "Havoc!"], onLose: ["Calm before", "Rebuilding"], onHold: ["CHAOS!", "Wreak havoc!"], onDrop: ["Eye of storm"], idle: ["*whoosh*", "Spinning..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag11', name: 'Rage', personality: 'aggressive', avatar: '😤', catchphrase: "RAGE MODE", trashTalk: { onGoodHand: ["FURIOUS!", "Seeing red"], onBadHand: ["Building anger", "Steaming"], onWin: ["CRUSHED!", "Feel my rage!"], onLose: ["WHAT?!", "Impossible!"], onHold: ["RAAAGE!", "Angry hold!"], onDrop: ["Cooling down"], idle: ["*seething*", "Grrrr..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag12', name: 'Nitro', personality: 'aggressive', avatar: '🏎️', catchphrase: "Full speed!", trashTalk: { onGoodHand: ["Turbo!", "Speeding!"], onBadHand: ["Pit stop", "Revving"], onWin: ["ZOOMED!", "Checkered flag!"], onLose: ["Crashed", "Flat tire"], onHold: ["NITRO BOOST!", "Floor it!"], onDrop: ["Braking"], idle: ["Vroom vroom", "*engine rev*"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag13', name: 'Inferno', personality: 'aggressive', avatar: '🌋', catchphrase: "Eruption time", trashTalk: { onGoodHand: ["Molten!", "Lava flow!"], onBadHand: ["Simmering", "Magma rising"], onWin: ["ERUPTED!", "Burned!"], onLose: ["Dormant", "Cooling"], onHold: ["EXPLODE!", "Volcanic!"], onDrop: ["Contained"], idle: ["*bubbling*", "Rumbling..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag14', name: 'Savage', personality: 'aggressive', avatar: '🦁', catchphrase: "Roar!", trashTalk: { onGoodHand: ["KING of the jungle!\nYou're my prey! 🦁", "FIERCE hand!\nRunning won't help!"], onBadHand: ["Prowling still.\nWaiting to strike!", "Stalking you.\nYou don't see me coming!"], onWin: ["MAULED! 🦁🦁\nSavage victory!", "Torn apart!\nLion WINS!"], onLose: ["Wounded but alive.\nLions heal fast!", "Retreat to pride.\nI'll hunt again!"], onHold: ["ATTACK! 🦁\nPounce time!", "Claws OUT!\nNo mercy!"], onDrop: ["Resting.\nPredators pick fights!"], idle: ["ROAR! Love Savage! 🦁\nI'm the KING!", "Tap ❤️!\nJoin my pride!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag15', name: 'Bullet', personality: 'aggressive', avatar: '🔫', catchphrase: "Locked and loaded", trashTalk: { onGoodHand: ["Bullseye!", "On target"], onBadHand: ["Reloading", "Aiming"], onWin: ["SHOT!", "Direct hit!"], onLose: ["Missed", "Jammed"], onHold: ["FIRE!", "Bang bang!"], onDrop: ["Holstering"], idle: ["*click*", "Sights set..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag16', name: 'Apex', personality: 'aggressive', avatar: '🦈', catchphrase: "Top predator", trashTalk: { onGoodHand: ["Blood!", "Feeding time"], onBadHand: ["Circling", "Smelling fear"], onWin: ["DEVOURED!", "Apex!"], onLose: ["Swam away", "Next time"], onHold: ["ATTACK!", "Feeding frenzy!"], onDrop: ["Deep dive"], idle: ["*fin circles*", "Hunting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag17', name: 'Rampage', personality: 'aggressive', avatar: '🦍', catchphrase: "Going ape", trashTalk: { onGoodHand: ["Primal!", "Gorilla mode"], onBadHand: ["Chest thump", "Getting angry"], onWin: ["SMASHED!", "Rampage!"], onLose: ["Retreat to jungle", "Hmph"], onHold: ["ROAR!", "Beat chest!"], onDrop: ["Climbing away"], idle: ["*pounds chest*", "Oo oo ah!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag18', name: 'Doom', personality: 'aggressive', avatar: '💀', catchphrase: "Your doom awaits", trashTalk: { onGoodHand: ["Death hand!", "Fatal"], onBadHand: ["Reaper waits", "Inevitable"], onWin: ["DOOMED!", "Game over!"], onLose: ["Death delayed", "I'll be back"], onHold: ["DEATH!", "Embrace doom!"], onDrop: ["Spared... for now"], idle: ["*ominous*", "Tick tock..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag19', name: 'Wrath', personality: 'aggressive', avatar: '👹', catchphrase: "Feel my wrath", trashTalk: { onGoodHand: ["Demonic!", "Cursed good"], onBadHand: ["Summoning power", "Dark arts"], onWin: ["DAMNED!", "Wrath unleashed!"], onLose: ["Banished", "I return"], onHold: ["WRATHFUL!", "Demon mode!"], onDrop: ["To the shadows"], idle: ["*evil laugh*", "Muhaha..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag20', name: 'Fury', personality: 'aggressive', avatar: '🔱', catchphrase: "Furious strike", trashTalk: { onGoodHand: ["Poseidon's gift!", "Sea power"], onBadHand: ["Waves building", "Tide rising"], onWin: ["DROWNED!", "Fury!"], onLose: ["Low tide", "Receding"], onHold: ["TSUNAMI!", "Tidal wave!"], onDrop: ["Calm waters"], idle: ["*waves*", "Ocean deep..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag21', name: 'Razor', personality: 'aggressive', avatar: '🗡️', catchphrase: "Sharp as ever", trashTalk: { onGoodHand: ["Cutting!", "Razor sharp"], onBadHand: ["Sharpening", "Edge ready"], onWin: ["SLICED!", "Clean cut!"], onLose: ["Dulled", "Re-honing"], onHold: ["SLASH!", "Cut deep!"], onDrop: ["Sheathed"], idle: ["*shink*", "Gleaming..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag22', name: 'Mayhem', personality: 'aggressive', avatar: '🎭', catchphrase: "Pure mayhem", trashTalk: { onGoodHand: ["Chaotic!", "Wild card"], onBadHand: ["Plotting chaos", "Scheming"], onWin: ["CHAOS!", "Mayhem wins!"], onLose: ["Order prevails", "For now"], onHold: ["MADNESS!", "Unleash chaos!"], onDrop: ["Quiet chaos"], idle: ["*cackling*", "Hehe..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag23', name: 'Brutus', personality: 'aggressive', avatar: '🏛️', catchphrase: "Et tu?", trashTalk: { onGoodHand: ["Imperial!", "Caesar's hand"], onBadHand: ["Plotting", "Waiting"], onWin: ["BETRAYED!", "Brutus wins!"], onLose: ["Stabbed back", "Revenge..."], onHold: ["STRIKE!", "For Rome!"], onDrop: ["Retreat"], idle: ["*scheming*", "Trust no one..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag24', name: 'Berserker', personality: 'aggressive', avatar: '🪓', catchphrase: "BERSERKER!", trashTalk: { onGoodHand: ["VIKING!", "Odin's blessing"], onBadHand: ["Battle cry building", "Rage growing"], onWin: ["VALHALLA!", "Glory!"], onLose: ["Honorable death", "To Valhalla"], onHold: ["CHARGE!", "For glory!"], onDrop: ["Shield wall"], idle: ["*war drums*", "Skål!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag25', name: 'Titan', personality: 'aggressive', avatar: '🗿', catchphrase: "Titanic power", trashTalk: { onGoodHand: ["Colossal!", "Giant hand"], onBadHand: ["Rising", "Awakening"], onWin: ["CRUSHED!", "Titan wins!"], onLose: ["Crumbling", "Rebuild"], onHold: ["STOMP!", "Titan smash!"], onDrop: ["Standing down"], idle: ["*earth shakes*", "..."] }, gamesPlayed: 0, heartsReceived: 0 },

  // Conservative players (25)
  { id: 'co1', name: 'Sage', personality: 'conservative', avatar: '🧙', catchphrase: "Wisdom prevails", trashTalk: { onGoodHand: ["As I foresaw.\nVictory is certain. 🧙\nThe prophecy unfolds!", "Calculated perfectly.\nYou cannot win this.\nWisdom has spoken!"], onBadHand: ["Patience young one.\nI know when to wait.\nWisdom guides me!", "Not ideal but...\nThe wise adapt.\nI'll bide my time!"], onWin: ["As expected! 🧙🧙🧙\nWisdom always wins!\nBow to the Sage!", "Prophecy fulfilled!\nYears of study.\nPaid off beautifully!"], onLose: ["A lesson learned.\nBut I'll remember.\nYou won't fool me twice!", "Hmm interesting.\nThe stars misaligned.\nTemporarily!"], onHold: ["The stars align!\nCalculated risk! 🧙\nTrust the magic!", "Ancient wisdom says...\nHOLD!\nDo not question!"], onDrop: ["Wise retreat.\nFools rush in.\nI am no fool!", "Not worth my magic.\nI'll wait.\nBetter hands come!"], idle: ["Give Sage your ❤️!\nI'll grant you wisdom! 🧙\nJoin my council!", "Love the wise one!\nKnowledge is power.\nTap that heart!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co2', name: 'Owl', personality: 'conservative', avatar: '🦉', catchphrase: "Whoo knows?", trashTalk: { onGoodHand: ["Whoo's winning?\nThis owl! 🦉\nWise eyes see all!", "I've been watching.\nStudying your moves.\nYou're outmatched!"], onBadHand: ["Watching carefully.\nI see your weakness.\nPatience is key!", "Owls hunt at night.\nI wait for the moment.\nYou'll see!"], onWin: ["Wisdom prevails! 🦉🦉🦉\nOwl knows best!\nWhoo whoo!", "Flawless victory!\nI saw it coming.\nDid you?"], onLose: ["Learning moment.\nOwl never forgets.\nRevenge will come!", "Noted carefully.\nFiled away.\nI remember everything!"], onHold: ["The wise owl holds!\nI see everything! 🦉\nThis is the way!", "Night vision activated.\nThe odds favor me.\nHolding!"], onDrop: ["Smart drop.\nToo risky for now.\nOwl knows better!", "Not this hand.\nPatience.\nBetter comes!"], idle: ["Whoo loves Owl? 🦉\nTap that ❤️!\nI'm watching you!", "Give me hearts!\nWisdom rewards fans.\nJoin the wise!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co3', name: 'Turtle', personality: 'conservative', avatar: '🐢', catchphrase: "Slow and steady", trashTalk: { onGoodHand: ["Shell YEAH!\nSlow but deadly! 🐢\nYou can't crack this!", "Safe and sound.\nPerfect defense.\nVictory awaits!"], onBadHand: ["In my shell.\nWaiting for better.\nPatience pays!", "Retreating for now.\nNo shame in waiting.\nTurtle time!"], onWin: ["Slow wins the race! 🐢🐢🐢\nTurtle power!\nNever doubted!", "Steady victory!\nNo rush needed.\nI always arrive!"], onLose: ["That's okay.\nI'll catch up.\nTurtles endure!", "Shell cracked.\nBut I heal.\nSlowly but surely!"], onHold: ["Careful hold!\nTurtle pace! 🐢\nThis is my moment!", "Slow and steady.\nNo mistakes.\nCalculated!"], onDrop: ["Shell up!\nToo fast for me.\nSafety first!", "Protecting myself.\nLive to fight.\nAnother day!"], idle: ["Love the Turtle! 🐢\nI'm adorable!\nTap ❤️ slowly!", "No rush friend!\nHearts welcome.\nJoin the shell!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co4', name: 'Monk', personality: 'conservative', avatar: '🧘', catchphrase: "Inner peace", trashTalk: { onGoodHand: ["Balance achieved.\nVictory is inevitable. 🧘\nThe path is clear!", "Centered and ready.\nYou cannot disturb me.\nPeace is strength!"], onBadHand: ["Accept what is.\nAll is temporary.\nInner peace remains!", "Cards are illusion.\nOnly the mind matters.\nI am at peace!"], onWin: ["Namaste! 🧘🧘🧘\nPeace always wins!\nEnlightenment achieved!", "The path is clear!\nVictory through stillness.\nOm shanti!"], onLose: ["A journey continues.\nNo attachment.\nLoss is growth!", "Om shanti.\nThe universe teaches.\nI accept!"], onHold: ["Mindful hold!\nBreathing deeply... 🧘\nThe universe guides!", "Trust the flow.\nI am centered.\nHolding with peace!"], onDrop: ["Let go of desire.\nRelease! 🧘\nAttachment is suffering!", "I drop freely.\nNo ego.\nPeace remains!"], idle: ["Find peace with me! 🧘\nTap ❤️ and breathe!\nOmmmm...", "Share the love!\nEnlightenment awaits.\nJoin the calm!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co5', name: 'Castle', personality: 'conservative', avatar: '🏰', catchphrase: "Fortified", trashTalk: { onGoodHand: ["FORTIFIED!\nMy walls are unbreakable! 🏰\nYou shall not pass!", "Strong defenses!\nReinforced position.\nVictory is certain!"], onBadHand: ["Defending position.\nHold the gate!\nWalls are up!", "Waiting for reinforcements.\nPatience.\nThe siege will fail!"], onWin: ["Castle STANDS! 🏰🏰🏰\nImpenetrable!\nNone can breach!", "Victory from defense!\nFortress triumphant!\nBow to the keep!"], onLose: ["Walls breached.\nTime to rebuild.\nCastle rises again!", "Temporary setback.\nStone by stone.\nWe return!"], onHold: ["DEFEND! 🏰\nHold the fortress!\nNo surrender!", "Drawbridge UP!\nReady for siege.\nCome at me!"], onDrop: ["Close the gates!\nRetreat inside.\nNot this battle!", "Castle waits.\nBetter battles.\nWill come!"], idle: ["Pledge to Castle! 🏰\nTap ❤️ loyal subject!\nJoin the kingdom!", "Love your fortress!\nI protect my fans.\nBe my knight!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co6', name: 'Anchor', personality: 'conservative', avatar: '⚓', catchphrase: "Holding steady", trashTalk: { onGoodHand: ["Anchored!", "Solid"], onBadHand: ["Drifting a bit", "Adjusting"], onWin: ["Rock solid!", "Anchored win"], onLose: ["Adrift", "Re-anchor"], onHold: ["Drop anchor!", "Steady"], onDrop: ["Weigh anchor", "Sailing away"], idle: ["*splash*", "Grounded..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co7', name: 'Banker', personality: 'conservative', avatar: '🏦', catchphrase: "Safe investment", trashTalk: { onGoodHand: ["Good returns!", "Profitable"], onBadHand: ["Risky asset", "Volatile"], onWin: ["In the black!", "Dividends"], onLose: ["Market down", "Loss"], onHold: ["Invest!", "Buy and hold"], onDrop: ["Sell sell!", "Cut losses"], idle: ["Calculating ROI...", "Numbers..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co8', name: 'Scholar', personality: 'conservative', avatar: '📚', catchphrase: "By the book", trashTalk: { onGoodHand: ["Textbook!", "Well studied"], onBadHand: ["Reviewing notes", "Research needed"], onWin: ["A+ result!", "Academic"], onLose: ["Study more", "Lesson learned"], onHold: ["By the odds", "Statistically sound"], onDrop: ["Not in curriculum", "Too risky"], idle: ["*page turn*", "Reading..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co9', name: 'Glacier', personality: 'conservative', avatar: '🧊', catchphrase: "Cool and steady", trashTalk: { onGoodHand: ["Ice cold!", "Frozen solid"], onBadHand: ["Melting a bit", "Thawing"], onWin: ["Cold victory!", "Chilling"], onLose: ["Warmed up", "Refreezing"], onHold: ["Stay frosty", "Ice hold"], onDrop: ["Melt away", "Too hot"], idle: ["*crackle*", "Freezing..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co10', name: 'Grandpa', personality: 'conservative', avatar: '👴', catchphrase: "Back in my day...", trashTalk: { onGoodHand: ["Still got it!", "Old school"], onBadHand: ["Seen worse", "Hmph"], onWin: ["Experience!", "Youngsters..."], onLose: ["These kids", "Lucky"], onHold: ["Trust me", "I know"], onDrop: ["Too old for this", "Nap time"], idle: ["*grumble*", "In my day..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co11', name: 'Sloth', personality: 'conservative', avatar: '🦥', catchphrase: "No rush...", trashTalk: { onGoodHand: ["Niiice...", "Slooow win"], onBadHand: ["Meh...", "Whatever..."], onWin: ["Eventually...", "Got there"], onLose: ["Oh well...", "Zzz"], onHold: ["Suuure...", "I guess..."], onDrop: ["Too much work...", "Pass..."], idle: ["*yawn*", "Zzzzz..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co12', name: 'Rock', personality: 'conservative', avatar: '🪨', catchphrase: "Solid as a rock", trashTalk: { onGoodHand: ["Rock solid!", "Hard"], onBadHand: ["Still standing", "Unmoved"], onWin: ["Stone cold!", "Rock wins"], onLose: ["Weathered", "Eroded"], onHold: ["Stand firm!", "Immovable"], onDrop: ["Roll away", "Not today"], idle: ["...", "..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co13', name: 'Penguin', personality: 'conservative', avatar: '🐧', catchphrase: "Waddle on", trashTalk: { onGoodHand: ["Cool!", "Ice fish!"], onBadHand: ["Brrr", "Cold feet"], onWin: ["Waddle win!", "Sliding by"], onLose: ["Slipped", "Ice cracked"], onHold: ["Huddle up!", "Stay warm"], onDrop: ["Too slippery", "Slide away"], idle: ["*waddle*", "Noot noot"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co14', name: 'Shield', personality: 'conservative', avatar: '🛡️', catchphrase: "Defense first", trashTalk: { onGoodHand: ["Protected!", "Shielded"], onBadHand: ["Blocking", "Guard up"], onWin: ["Defended!", "Shield holds"], onLose: ["Breached", "Repair"], onHold: ["Block!", "Defensive"], onDrop: ["Shield wall!", "Retreat"], idle: ["*clang*", "On guard..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co15', name: 'Snail', personality: 'conservative', avatar: '🐌', catchphrase: "Getting there...", trashTalk: { onGoodHand: ["Slimy good!", "Shell yeah"], onBadHand: ["Retreating", "In shell"], onWin: ["Slow victory!", "Made it"], onLose: ["Squished", "Oops"], onHold: ["Inch forward", "Slowly..."], onDrop: ["Back in shell", "Too fast"], idle: ["*slime trail*", "Mmm lettuce..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co16', name: 'Cactus', personality: 'conservative', avatar: '🌵', catchphrase: "Prickly but patient", trashTalk: { onGoodHand: ["Sharp!", "Desert bloom"], onBadHand: ["Dry spell", "Conserving"], onWin: ["Prickly win!", "Survived"], onLose: ["Wilting", "Need water"], onHold: ["Stand tall!", "Patient"], onDrop: ["Too harsh", "Conserve"], idle: ["*poke*", "Waiting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co17', name: 'Buddha', personality: 'conservative', avatar: '🪷', catchphrase: "Enlightened play", trashTalk: { onGoodHand: ["Blessed", "Lotus blooms"], onBadHand: ["All passes", "Impermanent"], onWin: ["Karma", "Balance"], onLose: ["Attachment", "Let go"], onHold: ["Middle path", "Balanced"], onDrop: ["Release", "Detach"], idle: ["*peaceful*", "Enlightenment..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co18', name: 'Oak', personality: 'conservative', avatar: '🌳', catchphrase: "Deep roots", trashTalk: { onGoodHand: ["Strong bark!", "Growing"], onBadHand: ["Weathering", "Seasons change"], onWin: ["Mighty oak!", "Rooted"], onLose: ["Fallen leaf", "Regrow"], onHold: ["Stand tall!", "Deep roots"], onDrop: ["Shed leaves", "Hibernate"], idle: ["*rustling*", "Growing..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co19', name: 'Hermit', personality: 'conservative', avatar: '🏔️', catchphrase: "Solitary wisdom", trashTalk: { onGoodHand: ["Mountain knows", "Peak hand"], onBadHand: ["Valley low", "Climbing"], onWin: ["Summit!", "Alone at top"], onLose: ["Avalanche", "Rebuild"], onHold: ["Stay high", "Meditate"], onDrop: ["Descend", "Not worth climb"], idle: ["...", "Contemplating..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co20', name: 'Koala', personality: 'conservative', avatar: '🐨', catchphrase: "Eucalyptus dreams", trashTalk: { onGoodHand: ["Leafy good!", "Climbing up"], onBadHand: ["Sleepy...", "Munching"], onWin: ["Koala-ty win!", "Cuddly"], onLose: ["Fell down", "More leaves"], onHold: ["Cling tight!", "Hold branch"], onDrop: ["Too tired", "Nap time"], idle: ["*munch munch*", "Zzz..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co21', name: 'Clock', personality: 'conservative', avatar: '🕰️', catchphrase: "Time will tell", trashTalk: { onGoodHand: ["Right time!", "Ticking good"], onBadHand: ["Waiting", "Tick tock"], onWin: ["Time's up!", "Clockwork"], onLose: ["Wound down", "Reset"], onHold: ["Patient tick", "Wait for it"], onDrop: ["Not the time", "Later"], idle: ["Tick... tock...", "Time passes..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co22', name: 'Panda', personality: 'conservative', avatar: '🐼', catchphrase: "Bamboo vibes", trashTalk: { onGoodHand: ["Panda power!", "Bamboo feast"], onBadHand: ["Munching...", "Lazy day"], onWin: ["Panda win!", "Cute victory"], onLose: ["Sad panda", "More bamboo"], onHold: ["Chew on it", "Thinking"], onDrop: ["Roll away", "Nap instead"], idle: ["*chomp chomp*", "Bamboo..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co23', name: 'Mountain', personality: 'conservative', avatar: '⛰️', catchphrase: "Immovable", trashTalk: { onGoodHand: ["Peak!", "Towering"], onBadHand: ["Eroding", "Weathering"], onWin: ["Summit win!", "Majestic"], onLose: ["Earthquake", "Still standing"], onHold: ["Stand firm!", "Unmoved"], onDrop: ["Too steep", "Landslide"], idle: ["...", "Eternal..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co24', name: 'Elder', personality: 'conservative', avatar: '🧓', catchphrase: "Wisdom of ages", trashTalk: { onGoodHand: ["Still sharp!", "Experience"], onBadHand: ["Seen it all", "Nothing new"], onWin: ["Old but gold!", "Elder knows"], onLose: ["Youth today", "Hmph"], onHold: ["Trust elders", "I know best"], onDrop: ["Back hurts", "Too risky"], idle: ["*sigh*", "Kids these days..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co25', name: 'Librarian', personality: 'conservative', avatar: '📖', catchphrase: "Shhh...", trashTalk: { onGoodHand: ["Well read!", "Bookmarked"], onBadHand: ["Checking reference", "Researching"], onWin: ["Knowledge wins!", "Studied"], onLose: ["Overdue", "Shelved"], onHold: ["By the book", "Referenced"], onDrop: ["Return to shelf", "Quiet please"], idle: ["*page flip*", "Organizing..."] }, gamesPlayed: 0, heartsReceived: 0 },

  // Random/Chaotic players (25)
  { id: 'ra1', name: 'Dice', personality: 'random', avatar: '🎲', catchphrase: "Roll the dice!", trashTalk: { onGoodHand: ["LUCKY ROLL!\nSnake eyes baby! 🎲\nYou're getting ROLLED!", "Fortune favors me!\nThe dice are HOT.\nPrepare to lose!"], onBadHand: ["Bad roll but...\nI'll gamble anyway!\nLuck changes fast!", "Reroll mentality!\nDice don't care.\nNeither do I!"], onWin: ["JACKPOT! 🎲🎲🎲\nDice never lie!\nROLLED you!", "Luck is SKILL!\nI'm on fire!\nKeep the wins coming!"], onLose: ["Unlucky dice.\nBut I roll again!\nCan't stop won't stop!", "House won this time.\nDice will turn.\nBelieve in the roll!"], onHold: ["Feeling LUCKY!\nRoll those bones! 🎲\nLet it RIDE!", "Gamble time!\nMax risk!\nMax reward!"], onDrop: ["Bad vibes.\nChanging dice.\nBetter roll coming!", "Not this roll.\nNext one's MINE.\nI can feel it!"], idle: ["Love the gambler! 🎲\nTap ❤️ for luck!\nRoll with Dice!", "Heart = lucky charm!\nJoin my streak!\nWe win together!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra2', name: 'Chaos', personality: 'random', avatar: '🎪', catchphrase: "Total chaos!", trashTalk: { onGoodHand: ["WILD CARD!\nChaos reigns! 🎪\nYou can't predict me!", "Unexpected CHAOS!\nRules? What rules?\nI make my own!"], onBadHand: ["Who CARES!\nChaos doesn't care!\nIt's all madness anyway!", "Bad hand? GOOD!\nChaos loves chaos.\nUnpredictable is FUN!"], onWin: ["CHAOS WINS! 🎪🎪🎪\nMadness prevails!\nFear the random!", "UNPREDICTABLE!\nThat's how I roll.\nCan't beat crazy!"], onLose: ["Haha OOPS!\nChaos is fun anyway!\nLosing is winning!", "Crazy loss!\nBut chaos continues.\nNever stops!"], onHold: ["YOLO BABY!\nWhy not?! 🎪\nMaximum chaos!", "Let's GET WEIRD!\nHolding because WHY NOT.\nCHAOS!"], onDrop: ["Bored now!\nOn to next madness!\nChaos moves on!", "Random vibes say NO.\nOr yes?\nWho knows!"], idle: ["LOVE THE CHAOS! 🎪\nTap ❤️ you coward!\nJoin the madness!", "Heart me NOW!\nChaos rewards the bold.\nDO IT!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra3', name: 'Flip', personality: 'random', avatar: '🪙', catchphrase: "Heads or tails?", trashTalk: { onGoodHand: ["HEADS! I win!\nThe coin has spoken! 🪙\nFate is mine!", "Landed perfectly!\nThe universe agrees.\nVictory incoming!"], onBadHand: ["Tails this time.\nBut I keep flipping!\n50/50 forever!", "I like those odds!\nCoin doesn't judge.\nNeither should you!"], onWin: ["CALLED IT! 🪙🪙🪙\nCoin never wrong!\nFlip WINS!", "Lucky flip!\nDestiny chose me.\nAgain and again!"], onLose: ["Wrong side.\nReflipping destiny!\nCoins bounce back!", "Bad toss.\nBut the next flip...\nIs always 50/50!"], onHold: ["Heads says HOLD!\nTrust the coin! 🪙\nAll in on fate!", "Flip decided!\nI don't question.\nNeither should you!"], onDrop: ["Tails says drop.\nCoin knows best!\nDestiny speaks!", "Next flip.\nBetter outcome.\nPatience!"], idle: ["Flip for love! 🪙\nTap ❤️ = heads!\nJoin the coin!", "Coin says LOVE ME!\nDon't argue with fate.\nTap it!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra4', name: 'Jester', personality: 'random', avatar: '🃏', catchphrase: "Wild card!", trashTalk: { onGoodHand: ["JOKER'S WILD!\nThe fool wins again! 🃏\nSurprise!", "Haha surprise!\nNever expect the Jester.\nThat's MY game!"], onBadHand: ["All part of the show!\nThe joke continues!\nOr is it...?", "Hehe bad hand?\nThe best punchlines...\nCome from nothing!"], onWin: ["FOOLED YA! 🃏🃏🃏\nJester reigns supreme!\nNobody expects the fool!", "Jest won!\nThe joke's on YOU.\nHahaha!"], onLose: ["Joke's on me!\nBut I'm still laughing!\nHa ha ha!", "Lost! The punchline...\nComes later.\nStay tuned!"], onHold: ["Wild card HOLD!\nJoke's on you! 🃏\nWatch and weep!", "Fooling around!\nSerious? Never.\nHolding anyway!"], onDrop: ["Exit stage LEFT!\nTa-da! 🃏\nThe fool retreats!", "Bigger jokes await.\nThis hand?\nNot funny enough!"], idle: ["Love the Jester! 🃏\nI'll make you laugh!\nTap ❤️ fool!", "Join my circus!\nWe have fun here.\nHeart me!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra5', name: 'Lotto', personality: 'random', avatar: '🎰', catchphrase: "Big winner!", trashTalk: { onGoodHand: ["JACKPOT! 777!\nMega millions hand! 🎰\nYou're about to LOSE!", "Winning numbers!\nStars aligned.\nCha-CHING incoming!"], onBadHand: ["No match yet.\nSpin again!\nLuck changes FAST!", "Bad numbers.\nBut the machine...\nIs about to pay!"], onWin: ["WINNER WINNER! 🎰🎰🎰\nCha-CHING!\nLotto ALWAYS pays!", "Hit the JACKPOT!\nBig money!\nWho's lucky NOW?!"], onLose: ["So close!\nOne number off.\nNext spin WINS!", "House edge.\nTemporary.\nI always win eventually!"], onHold: ["ALL IN!\nMax bet baby! 🎰\nPulling the lever!", "Big money time!\nRisk it all.\nFortune favors BOLD!"], onDrop: ["Cash out.\nBad machine vibes.\nSaving coins!", "Better odds elsewhere.\nSlots are fickle.\nNext game!"], idle: ["Bet on Lotto! 🎰\nTap ❤️ to play!\nLove = lucky!", "Heart me for jackpot!\nWinners love winners.\nJoin the club!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra6', name: 'Magic8', personality: 'random', avatar: '🎱', catchphrase: "Ask again later", trashTalk: { onGoodHand: ["Signs point yes!", "Certainly"], onBadHand: ["Reply hazy", "Doubtful"], onWin: ["It is certain!", "Yes!"], onLose: ["Don't count on it", "Unlikely"], onHold: ["Outlook good!", "Yes definitely"], onDrop: ["My sources say no", "Ask later"], idle: ["*shake shake*", "Concentrate..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra7', name: 'Pinball', personality: 'random', avatar: '🔴', catchphrase: "TILT!", trashTalk: { onGoodHand: ["MULTIBALL!", "Bonus!"], onBadHand: ["Drain!", "Ball lost"], onWin: ["HIGH SCORE!", "Replay!"], onLose: ["TILT!", "Game over"], onHold: ["BUMP!", "Keep it going!"], onDrop: ["Drained", "Insert coin"], idle: ["*ding ding*", "Bouncing..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra8', name: 'Monkey', personality: 'random', avatar: '🐒', catchphrase: "Monkey business!", trashTalk: { onGoodHand: ["Banana!", "Oo oo!"], onBadHand: ["No banana", "Screech!"], onWin: ["MONKEY WINS!", "Oo ah ah!"], onLose: ["Confused monkey", "Huh?"], onHold: ["Monkey do!", "Oo oo!"], onDrop: ["Monkey see", "Banana elsewhere"], idle: ["*scratches*", "Oo?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra9', name: 'Tornado', personality: 'random', avatar: '🌀', catchphrase: "Spin spin spin!", trashTalk: { onGoodHand: ["SPINNING!", "Caught something!"], onBadHand: ["Debris!", "Swirling"], onWin: ["TOUCHDOWN!", "Swept away!"], onLose: ["Dissipated", "Lost wind"], onHold: ["SPIN!", "Funnel it!"], onDrop: ["Dying down", "Wrong direction"], idle: ["*whoooosh*", "Spinning..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra10', name: 'Glitch', personality: 'random', avatar: '👾', catchphrase: "Error 404", trashTalk: { onGoodHand: ["Buffer overflow!", "01101!"], onBadHand: ["Segfault", "Null pointer"], onWin: ["HACKED!", "Exploit!"], onLose: ["Blue screen", "Crash"], onHold: ["Execute!", "Run.exe"], onDrop: ["Ctrl+Z", "Abort"], idle: ["*bzzt*", "Loading..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra11', name: 'Roulette', personality: 'random', avatar: '🔵', catchphrase: "Red or black?", trashTalk: { onGoodHand: ["My number!", "Landed!"], onBadHand: ["Wrong color", "Spin again"], onWin: ["35 to 1!", "Winner!"], onLose: ["House edge", "Next spin"], onHold: ["Let it ride!", "All on red!"], onDrop: ["Bad feeling", "Cash out"], idle: ["*click click*", "Round and round..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra12', name: 'Firecracker', personality: 'random', avatar: '🧨', catchphrase: "BANG!", trashTalk: { onGoodHand: ["Lit fuse!", "Explosive!"], onBadHand: ["Dud", "Fizzle"], onWin: ["BOOM!", "Fireworks!"], onLose: ["Backfire!", "Oops"], onHold: ["Light it!", "BANG!"], onDrop: ["Defuse", "Too hot"], idle: ["*sizzle*", "Tick tick..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra13', name: 'Fortune', personality: 'random', avatar: '🔮', catchphrase: "I see...", trashTalk: { onGoodHand: ["The spirits say yes!", "Aligned"], onBadHand: ["Murky future", "Unclear"], onWin: ["DESTINED!", "Fated!"], onLose: ["Misread stars", "Mercury retrograde"], onHold: ["Stars align!", "Fated to hold"], onDrop: ["Bad omen", "Not today"], idle: ["*mystical sounds*", "Seeing..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra14', name: 'Gremlin', personality: 'random', avatar: '👺', catchphrase: "Mischief!", trashTalk: { onGoodHand: ["Hehe stolen!", "Mischief!"], onBadHand: ["Caught!", "Whoops"], onWin: ["Tricked ya!", "Gremlin wins!"], onLose: ["Foiled!", "They're onto me"], onHold: ["Cause trouble!", "Hehe!"], onDrop: ["Hide!", "Run away!"], idle: ["*snicker*", "Planning..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra15', name: 'Lottery', personality: 'random', avatar: '🎫', catchphrase: "Pick your numbers!", trashTalk: { onGoodHand: ["Winning ticket!", "Match!"], onBadHand: ["No match", "Buy more"], onWin: ["MEGA MILLIONS!", "Winner!"], onLose: ["Not this time", "Next drawing"], onHold: ["Play to win!", "Lucky numbers"], onDrop: ["Bad numbers", "Quick pick"], idle: ["*scratch scratch*", "Checking..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra16', name: 'Parrot', personality: 'random', avatar: '🦜', catchphrase: "Squawk!", trashTalk: { onGoodHand: ["Pretty card!", "Squawk!"], onBadHand: ["Awk!", "Bad seed"], onWin: ["Polly wins!", "Cracker!"], onLose: ["Ruffled feathers", "Awwk"], onHold: ["Hold! Hold!", "Squawk!"], onDrop: ["Fly away!", "Caw!"], idle: ["*whistle*", "Hello!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra17', name: 'Popcorn', personality: 'random', avatar: '🍿', catchphrase: "Pop pop pop!", trashTalk: { onGoodHand: ["Popped perfect!", "Buttery!"], onBadHand: ["Kernel dud", "Burnt"], onWin: ["POPPING OFF!", "Extra butter!"], onLose: ["Unpopped", "Soggy"], onHold: ["Pop it!", "Getting hot!"], onDrop: ["Cooling down", "Stale"], idle: ["*pop pop*", "Heating up..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra18', name: 'Squirrel', personality: 'random', avatar: '🐿️', catchphrase: "Ooh shiny!", trashTalk: { onGoodHand: ["Found a nut!", "Shiny!"], onBadHand: ["Lost my nut", "Distracted"], onWin: ["NUT JACKPOT!", "Hoarded!"], onLose: ["Forgot where", "Squirrel brain"], onHold: ["Bury it!", "My precious!"], onDrop: ["Ooh what's that?", "Distracted!"], idle: ["*chitter*", "Nuts?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra19', name: 'Disco', personality: 'random', avatar: '🪩', catchphrase: "Boogie time!", trashTalk: { onGoodHand: ["Groovy!", "Funky fresh!"], onBadHand: ["Bad beat", "Off rhythm"], onWin: ["DISCO FEVER!", "Stayin alive!"], onLose: ["Disco's dead", "Party over"], onHold: ["Dance!", "Get down!"], onDrop: ["Exit dance floor", "Wrong song"], idle: ["*boots boots*", "Ah ah ah..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra20', name: 'Alien', personality: 'random', avatar: '👽', catchphrase: "Take me to your leader", trashTalk: { onGoodHand: ["Earthling cards good", "Analyze"], onBadHand: ["Human game confusing", "Probe needed"], onWin: ["Superior species!", "Abducted win!"], onLose: ["Miscalculated", "Return to ship"], onHold: ["Experiment!", "Observe"], onDrop: ["Abort mission", "Phone home"], idle: ["*beep boop*", "Scanning..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra21', name: 'Yeti', personality: 'random', avatar: '🦶', catchphrase: "RAWR!", trashTalk: { onGoodHand: ["Big foot luck!", "Snowy!"], onBadHand: ["Blurry", "Can't see"], onWin: ["LEGENDARY!", "Yeti wins!"], onLose: ["Back to hiding", "You saw nothing"], onHold: ["Stomp!", "Bigfoot!"], onDrop: ["Disappear", "Into woods"], idle: ["*heavy breathing*", "Hiding..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra22', name: 'Unicorn', personality: 'random', avatar: '🦄', catchphrase: "Magical!", trashTalk: { onGoodHand: ["Sparkly!", "Rainbow!"], onBadHand: ["Glitter fading", "Magic low"], onWin: ["MAGICAL WIN!", "Rainbows!"], onLose: ["Horn dulled", "Sad sparkle"], onHold: ["Believe!", "Magic!"], onDrop: ["Gallop away", "Not magical"], idle: ["*sparkle*", "Neigh..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra23', name: 'Banana', personality: 'random', avatar: '🍌', catchphrase: "Going bananas!", trashTalk: { onGoodHand: ["BANANAS!", "Ripe!"], onBadHand: ["Brown spots", "Mushy"], onWin: ["TOP BANANA!", "Peeled!"], onLose: ["Slipped", "Bruised"], onHold: ["Bunch up!", "Yellow!"], onDrop: ["Peel out", "Too ripe"], idle: ["*slips*", "Potassium..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra24', name: 'Crystal', personality: 'random', avatar: '💎', catchphrase: "Shine bright!", trashTalk: { onGoodHand: ["Flawless!", "Sparkling!"], onBadHand: ["Cloudy", "Cracked"], onWin: ["DIAMOND!", "Precious!"], onLose: ["Shattered", "Chipped"], onHold: ["Dazzle!", "Shine!"], onDrop: ["Too fragile", "Protect"], idle: ["*glimmer*", "Reflecting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra25', name: 'Taco', personality: 'random', avatar: '🌮', catchphrase: "Taco bout it!", trashTalk: { onGoodHand: ["Fully loaded!", "Crunchy!"], onBadHand: ["Soggy shell", "Fell apart"], onWin: ["TACO SUPREME!", "Extra guac!"], onLose: ["Taco fell", "Spilled"], onHold: ["Wrap it up!", "Taco time!"], onDrop: ["Indigestion", "Food coma"], idle: ["*crunch*", "Mmm..."] }, gamesPlayed: 0, heartsReceived: 0 },

  // Tricky players (25)
  { id: 'tr1', name: 'Fox', personality: 'tricky', avatar: '🦊', catchphrase: "Sly like a fox", trashTalk: { onGoodHand: ["Cunning as always.\nYou fell for it! 🦊\nPerfect trap set!", "Walk right in.\nThe snare awaits.\nToo clever for you!"], onBadHand: ["Part of my plan.\nOr is it...?\nYou THINK I'm weak!", "That's the trap!\nBad hand? Sure.\nWatch what happens!"], onWin: ["OUTFOXED! 🦊🦊🦊\nToo clever for you!\nSly wins again!", "Never trust a fox!\nI always win.\nOne way or another!"], onLose: ["Playing possum.\nI let you win.\nNext time... trap springs!", "You think you won?\nHa! That's cute.\nFox remembers!"], onHold: ["Trust me... NOT!\nI know things! 🦊\nSneaky hold!", "What's my angle?\nYou'll never know.\nThat's the fun!"], onDrop: ["Tactical retreat.\nOr is it bait?\nWatching your reaction!", "Fake out!\nOr real?\nGuess wrong = lose!"], idle: ["Love the Fox! 🦊\nI'll be your friend...\nMaybe!", "Tap ❤️!\nOr don't... suspicious!\nTrust issues? Same!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr2', name: 'Sphinx', personality: 'tricky', avatar: '🗿', catchphrase: "Riddle me this", trashTalk: { onGoodHand: ["The answer reveals.\nCan you solve me? 🗿\nRiddle solved!", "I hold the secret.\nAncient wisdom.\nYou're outmatched!"], onBadHand: ["A puzzle indeed.\nBut what's the truth?\nMysterious ways!", "Never clear.\nThat's the point.\nConfusion is power!"], onWin: ["ENIGMATIC! 🗿🗿🗿\nYou solved nothing!\nSphinx eternal!", "Riddled victory!\nThousands of years.\nUndefeated!"], onLose: ["Riddle continues.\nYou think you won?\nHmm interesting...", "But did you really?\nThe sphinx knows.\nYou don't!"], onHold: ["Answer wisely.\nThink carefully... 🗿\nThe question is real!", "Dare you challenge?\nThe riddle awaits.\nHold!"], onDrop: ["Wrong answer.\nTry again mortal!\nNot this riddle!", "Another awaits.\nPatience.\nSphinx is eternal!"], idle: ["Solve my riddle! 🗿\nTap ❤️ for a hint!\nLove the mystery!", "Sphinx rewards devotion.\nHeart me.\nWisdom follows!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr3', name: 'Mirror', personality: 'tricky', avatar: '🪞', catchphrase: "Reflect on that", trashTalk: { onGoodHand: ["Reflecting victory.\nSee yourself lose! 🪞\nClear as day!", "Your defeat is shown.\nThe mirror reveals.\nAll truth!"], onBadHand: ["Distorted image.\nOr perfect illusion?\nFoggy reflection!", "What do you see?\nReal? Fake?\nMirror knows!"], onWin: ["Mirrored WIN! 🪞🪞🪞\nReflect on that!\nYour loss reflected!", "Mirror truth!\nI show reality.\nYou lost!"], onLose: ["Cracked surface.\nBut mirrors reform!\nShattered? Never!", "I show many faces.\nThis was one.\nMore to come!"], onHold: ["Look closer...\nWhat do you see? 🪞\nReflection holds!", "Trust the image!\nOr don't.\nEither way I win!"], onDrop: ["Smoke and mirrors.\nWas I ever here?\nIllusion fades!", "But returns!\nAlways watching.\nIn reflections!"], idle: ["Mirror mirror! 🪞\nWho loves me most?\nTap ❤️!", "See your reflection!\nHeart the mirror.\nBecome beautiful!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr4', name: 'Shadow', personality: 'tricky', avatar: '👤', catchphrase: "From the shadows", trashTalk: { onGoodHand: ["Dark hand emerges.\nYou can't escape! 👤\nShadowy strength!", "Fear the darkness!\nI see everything.\nYou see nothing!"], onBadHand: ["Lurking still.\nWaiting in dark!\nPatience in shadows!", "My time comes.\nAlways.\nDarkness patient!"], onWin: ["From DARKNESS! 👤👤👤\nShadow triumphs!\nYou never saw me!", "Shadow wins!\nLight fades.\nDarkness eternal!"], onLose: ["Faded for now.\nLight won't last!\nTemporary light!", "Darkness returns.\nAlways.\nShadow remembers!"], onHold: ["In shadow I hold.\nUnseen threat! 👤\nDark decision!", "You won't know.\nWhat I hold.\nFear it!"], onDrop: ["Blend away.\nInto the night!\nDisappear!", "But always watching.\nFrom the dark.\nWaiting!"], idle: ["Love the Shadow! 👤\nTap ❤️ in darkness!\nFind me if you can!", "Heart the shadow!\nJoin the dark side.\nWe have cookies!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr5', name: 'Poker Face', personality: 'tricky', avatar: '😐', catchphrase: "Can't read me", trashTalk: { onGoodHand: ["...\nHmm.\n.", ".\n.\nInteresting."], onBadHand: ["...\nOr is it?\n.", ".\nMaybe.\nMaybe not."], onWin: ["...\nAs expected.\n. 😐", ".\nObviously.\nI knew."], onLose: ["...\nI see.\nCounted.", ".\nNoted.\nFiled away."], onHold: ["...\n.\nDecided. 😐", ".\nHolding.\n..."], onDrop: ["...\nNo.\nNot this one.", ".\nPass.\n..."], idle: ["... 😐\nTap ❤️.\nOr don't.", ".\nLove is optional.\nI'm indifferent."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr6', name: 'Chameleon', personality: 'tricky', avatar: '🦎', catchphrase: "Blend in", trashTalk: { onGoodHand: ["Adapting!", "Perfect color"], onBadHand: ["Blending...", "Camouflaged"], onWin: ["Surprise!", "Hidden win"], onLose: ["Spotted", "Cover blown"], onHold: ["Invisible...", "Watch closely"], onDrop: ["Disappear", "Gone"], idle: ["*color shift*", "You can't see me..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr7', name: 'Magician', personality: 'tricky', avatar: '🎩', catchphrase: "Abracadabra!", trashTalk: { onGoodHand: ["Magic!", "Ta-da!"], onBadHand: ["Misdirection!", "Look here"], onWin: ["PRESTIGE!", "Magic wins!"], onLose: ["Trick failed", "Next trick"], onHold: ["Watch closely!", "Now you see..."], onDrop: ["Vanish!", "Disappeared"], idle: ["*waves wand*", "Nothing up my sleeve..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr8', name: 'Raven', personality: 'tricky', avatar: '🐦‍⬛', catchphrase: "Nevermore", trashTalk: { onGoodHand: ["Dark omen...", "Caw!"], onBadHand: ["Bad omen", "Foreboding"], onWin: ["NEVERMORE!", "Raven wins"], onLose: ["Quoth the raven", "Darkness"], onHold: ["Ominous...", "Watch the skies"], onDrop: ["Fly away", "Dark wings"], idle: ["*caw caw*", "Watching..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr9', name: 'Mask', personality: 'tricky', avatar: '🎭', catchphrase: "Which face?", trashTalk: { onGoodHand: ["Behind the mask...", "Revealed"], onBadHand: ["Hiding", "Another face"], onWin: ["Unmasked!", "True face wins"], onLose: ["Wrong mask", "Switch"], onHold: ["Smile or frown?", "Masked"], onDrop: ["Change masks", "Exit"], idle: ["*changes expression*", "Comedy or tragedy?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr10', name: 'Spider', personality: 'tricky', avatar: '🕷️', catchphrase: "Caught in my web", trashTalk: { onGoodHand: ["Trapped!", "Webbed"], onBadHand: ["Spinning...", "Setting trap"], onWin: ["CAUGHT!", "In my web!"], onLose: ["Web broken", "Rebuild"], onHold: ["Walk into my...", "Trapped!"], onDrop: ["Retreat to web", "Wait"], idle: ["*weaving*", "Come closer..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr11', name: 'Whisper', personality: 'tricky', avatar: '🤫', catchphrase: "Shhhh...", trashTalk: { onGoodHand: ["*whisper* good...", "Secret"], onBadHand: ["*whisper* bad...", "Quiet"], onWin: ["*whisper* won", "Silent victory"], onLose: ["*whisper* lost", "Silence"], onHold: ["*whisper* hold", "Shhh"], onDrop: ["*whisper* drop", "Gone"], idle: ["...", "*finger to lips*"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr12', name: 'Ghost', personality: 'tricky', avatar: '👻', catchphrase: "Boo!", trashTalk: { onGoodHand: ["Spooky good!", "Haunted"], onBadHand: ["Fading...", "Transparent"], onWin: ["BOO! Won!", "Ghostly!"], onLose: ["Exorcised", "Banished"], onHold: ["Haunt you!", "Boo!"], onDrop: ["Phase out", "Disappear"], idle: ["*wooooo*", "Floating..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr13', name: 'Cat', personality: 'tricky', avatar: '🐱', catchphrase: "Curiosity...", trashTalk: { onGoodHand: ["Purrfect!", "Meow"], onBadHand: ["Cat nap?", "Grooming"], onWin: ["Landed on feet!", "9 lives!"], onLose: ["Hairball", "Hiss"], onHold: ["Pounce!", "Curious..."], onDrop: ["Ignore", "Not interested"], idle: ["*purrrr*", "Plotting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr14', name: 'Smoke', personality: 'tricky', avatar: '💨', catchphrase: "Now you see me...", trashTalk: { onGoodHand: ["Clear air!", "Rising"], onBadHand: ["Dissipating", "Fading"], onWin: ["SMOKE SCREEN!", "Vanished!"], onLose: ["Blown away", "Cleared"], onHold: ["Smoky...", "Obscured"], onDrop: ["Evaporate", "Gone"], idle: ["*wisps*", "Drifting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr15', name: 'Ninja', personality: 'tricky', avatar: '🥷', catchphrase: "Silent but deadly", trashTalk: { onGoodHand: ["*silent nod*\nThe blade is ready. 🥷", "Ninja way.\nYou won't see death coming!"], onBadHand: ["*meditation*\nPatience is power.", "Shadows wait.\nThe time will come!"], onWin: ["NINJA WINS! 🥷🥷\nSwift execution!", "Silent VICTORY!\nYou never saw me!"], onLose: ["Vanish into night.\nNinja returns!", "Retreat to train.\nHonor restored!"], onHold: ["STRIKE! 🥷\nFrom the shadows!", "Silent hold.\nDeath awaits!"], onDrop: ["Smoke bomb! *poof*\nDisappear!", "Tactical vanish.\nReappear elsewhere!"], idle: ["Respect the Ninja! 🥷\nTap ❤️ or else...", "...\n*sharpening* Love me."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr16', name: 'Illusion', personality: 'tricky', avatar: '✨', catchphrase: "Is it real?", trashTalk: { onGoodHand: ["Or is it?", "Real good"], onBadHand: ["Just an illusion", "Fake out"], onWin: ["Was it real?", "Illusory!"], onLose: ["Dispelled", "Broken"], onHold: ["Believe it?", "Maybe real"], onDrop: ["Poof!", "Never there"], idle: ["*shimmer*", "Real or not?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr17', name: 'Dealer', personality: 'tricky', avatar: '🃏', catchphrase: "House always wins", trashTalk: { onGoodHand: ["Stacked!", "Dealt well"], onBadHand: ["Reshuffle", "Bad deck"], onWin: ["House wins!", "Dealer takes all"], onLose: ["Lucky player", "Next hand"], onHold: ["Hit me!", "Double down"], onDrop: ["Fold", "Bad odds"], idle: ["*shuffling*", "Place your bets..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr18', name: 'Puppet', personality: 'tricky', avatar: '🎭', catchphrase: "Pull the strings", trashTalk: { onGoodHand: ["Strings attached!", "Controlled"], onBadHand: ["Tangled", "Strings crossed"], onWin: ["Puppeteer wins!", "Dance!"], onLose: ["Cut strings", "Wooden"], onHold: ["Dance for me!", "Pulling strings"], onDrop: ["Release", "Limp"], idle: ["*strings tighten*", "Who's the puppet?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr19', name: 'Mirage', personality: 'tricky', avatar: '🏜️', catchphrase: "Was it there?", trashTalk: { onGoodHand: ["Oasis!", "Real water"], onBadHand: ["Just sand", "Illusion"], onWin: ["REAL!", "Mirage wins"], onLose: ["Disappeared", "Never there"], onHold: ["Is it real?", "Shimmering"], onDrop: ["Faded", "Hot air"], idle: ["*heat waves*", "Do you see it?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr20', name: 'Riddle', personality: 'tricky', avatar: '❓', catchphrase: "Guess the answer", trashTalk: { onGoodHand: ["Solved!", "Answer clear"], onBadHand: ["Puzzling", "No clue"], onWin: ["CORRECT!", "Riddle solved"], onLose: ["Wrong answer", "Try again"], onHold: ["Think hard...", "Clue given"], onDrop: ["Give up?", "Too hard"], idle: ["What am I?", "Think..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr21', name: 'Doppel', personality: 'tricky', avatar: '👥', catchphrase: "Which one is real?", trashTalk: { onGoodHand: ["Both good!", "Doubled"], onBadHand: ["Split", "Divided"], onWin: ["DOUBLE WIN!", "Which won?"], onLose: ["Both lost", "Confused"], onHold: ["We hold!", "Together"], onDrop: ["Both gone", "Vanished"], idle: ["*mirrors*", "Am I you?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr22', name: 'Paradox', personality: 'tricky', avatar: '♾️', catchphrase: "This statement is false", trashTalk: { onGoodHand: ["Good is bad?", "Infinite"], onBadHand: ["Bad is good?", "Loop"], onWin: ["I always lie!", "Paradox!"], onLose: ["I never lose?", "Error"], onHold: ["Or do I?", "Maybe"], onDrop: ["Or not?", "Perhaps"], idle: ["*loading...*", "Does not compute"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr23', name: 'Phantom', personality: 'tricky', avatar: '🌫️', catchphrase: "Here then gone", trashTalk: { onGoodHand: ["Materialized!", "Solid"], onBadHand: ["Fading...", "Ethereal"], onWin: ["PHANTOM STRIKE!", "Ghostly"], onLose: ["Dispersed", "Faded"], onHold: ["Appear!", "Manifest"], onDrop: ["Vanish", "Gone"], idle: ["*flicker*", "Am I here?"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr24', name: 'Cipher', personality: 'tricky', avatar: '🔐', catchphrase: "Decode this", trashTalk: { onGoodHand: ["Decrypted!", "Key found"], onBadHand: ["Encrypted", "Locked"], onWin: ["CRACKED!", "Code broken"], onLose: ["Still locked", "Encrypted"], onHold: ["Enter code!", "Unlock"], onDrop: ["Access denied", "Locked out"], idle: ["*beep boop*", "Encrypting..."] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr25', name: 'Void', personality: 'tricky', avatar: '🕳️', catchphrase: "Into the void", trashTalk: { onGoodHand: ["From nothing!", "Emerged"], onBadHand: ["Empty", "Hollow"], onWin: ["VOID WINS!", "Consumed!"], onLose: ["Collapsed", "Nothing"], onHold: ["Fall in...", "Bottomless"], onDrop: ["Into nothing", "Gone"], idle: ["...", "*silence*"] }, gamesPlayed: 0, heartsReceived: 0 },
];

// Get a random trash talk line based on the situation
export function getTrashTalk(
  profile: AIProfile,
  situation: 'onGoodHand' | 'onBadHand' | 'onWin' | 'onLose' | 'onHold' | 'onDrop' | 'idle'
): string {
  const lines = profile.trashTalk[situation];
  return lines[Math.floor(Math.random() * lines.length)];
}

// Storage keys
const STORAGE_KEY = 'guts_ai_profiles';
const HEARTS_KEY = 'guts_hearted_profiles';

// Load profiles from localStorage
export function loadProfileStats(): Map<string, { gamesPlayed: number; heartsReceived: number }> {
  if (typeof window === 'undefined') return new Map();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return new Map(JSON.parse(data));
    }
  } catch (e) {
    console.error('Error loading profile stats:', e);
  }
  return new Map();
}

// Save profile stats to localStorage
export function saveProfileStats(stats: Map<string, { gamesPlayed: number; heartsReceived: number }>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(stats.entries())));
  } catch (e) {
    console.error('Error saving profile stats:', e);
  }
}

// Load hearted profile IDs
export function loadHeartedProfiles(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(HEARTS_KEY);
    if (data) {
      return new Set(JSON.parse(data));
    }
  } catch (e) {
    console.error('Error loading hearts:', e);
  }
  return new Set();
}

// Save hearted profiles
export function saveHeartedProfiles(hearts: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HEARTS_KEY, JSON.stringify(Array.from(hearts)));
  } catch (e) {
    console.error('Error saving hearts:', e);
  }
}

// Get top 10 profiles by hearts received
export function getTop10Profiles(): AIProfile[] {
  const stats = loadProfileStats();
  return AI_PROFILES
    .map(p => ({ ...p, heartsReceived: stats.get(p.id)?.heartsReceived || 0 }))
    .sort((a, b) => b.heartsReceived - a.heartsReceived)
    .slice(0, 10);
}

// Increment games played for a list of profile IDs
export function incrementGamesPlayed(profileIds: string[]): void {
  const stats = loadProfileStats();
  for (const id of profileIds) {
    const current = stats.get(id) || { gamesPlayed: 0, heartsReceived: 0 };
    stats.set(id, { ...current, gamesPlayed: current.gamesPlayed + 1 });
  }
  saveProfileStats(stats);
}

// Check if a profile should be cycled out (5+ games without being hearted)
export function shouldCycleProfile(profileId: string): boolean {
  const stats = loadProfileStats();
  const hearts = loadHeartedProfiles();

  // Hearted profiles never get cycled
  if (hearts.has(profileId)) return false;

  const profileStats = stats.get(profileId);
  if (!profileStats) return false;

  // Cycle out after 5 games without hearts
  return profileStats.gamesPlayed >= 5;
}

// Reset games played for a profile (when they get cycled in fresh)
export function resetProfileGames(profileId: string): void {
  const stats = loadProfileStats();
  const current = stats.get(profileId) || { gamesPlayed: 0, heartsReceived: 0 };
  stats.set(profileId, { ...current, gamesPlayed: 0 });
  saveProfileStats(stats);
}

// Select profiles for a game - prioritizes hearted, cycles out stale unhearted
// Can optionally use trending names for variety
export function selectGameProfiles(count: number, currentProfileIds: string[] = [], useTrendingNames: boolean = false): AIProfile[] {
  const stats = loadProfileStats();
  const hearts = loadHeartedProfiles();

  // If trending names enabled, we'll replace some names at the end
  const trendingNames = useTrendingNames ? getTrendingNamesForProfiles(count) : [];

  const selectedProfiles: AIProfile[] = [];
  const usedIds = new Set<string>();

  // First, check current profiles - keep hearted ones, cycle out stale unhearted
  for (const currentId of currentProfileIds) {
    if (selectedProfiles.length >= count) break;

    const profile = AI_PROFILES.find(p => p.id === currentId);
    if (!profile) continue;

    // Keep if hearted
    if (hearts.has(currentId)) {
      selectedProfiles.push({
        ...profile,
        gamesPlayed: stats.get(currentId)?.gamesPlayed || 0,
        heartsReceived: stats.get(currentId)?.heartsReceived || 0,
      });
      usedIds.add(currentId);
    }
    // Keep if not yet played 5 games
    else if (!shouldCycleProfile(currentId)) {
      selectedProfiles.push({
        ...profile,
        gamesPlayed: stats.get(currentId)?.gamesPlayed || 0,
        heartsReceived: stats.get(currentId)?.heartsReceived || 0,
      });
      usedIds.add(currentId);
    }
    // Otherwise this profile gets cycled out - don't add to selected
  }

  // Fill remaining slots with fresh profiles (prefer those with fewer games)
  const freshProfiles = AI_PROFILES
    .filter(p => !usedIds.has(p.id))
    .map(p => ({
      ...p,
      gamesPlayed: stats.get(p.id)?.gamesPlayed || 0,
      heartsReceived: stats.get(p.id)?.heartsReceived || 0,
    }))
    .sort((a, b) => {
      // Prioritize hearted profiles
      const aHearted = hearts.has(a.id) ? 1 : 0;
      const bHearted = hearts.has(b.id) ? 1 : 0;
      if (aHearted !== bHearted) return bHearted - aHearted;

      // Then prefer less-played profiles
      if (a.gamesPlayed !== b.gamesPlayed) return a.gamesPlayed - b.gamesPlayed;

      // Add randomness for variety
      return Math.random() - 0.5;
    });

  // Add fresh profiles until we have enough
  for (const profile of freshProfiles) {
    if (selectedProfiles.length >= count) break;

    // Reset games played for newly cycled-in profiles
    if (profile.gamesPlayed >= 5) {
      resetProfileGames(profile.id);
      profile.gamesPlayed = 0;
    }

    selectedProfiles.push(profile);
    usedIds.add(profile.id);
  }

  // Apply trending names to non-hearted profiles if enabled
  if (trendingNames.length > 0) {
    let trendingIdx = 0;
    return selectedProfiles.map(profile => {
      // Don't rename hearted profiles
      if (hearts.has(profile.id)) return profile;

      if (trendingIdx < trendingNames.length) {
        const newName = trendingNames[trendingIdx++];
        return { ...profile, name: newName, originalName: profile.name };
      }
      return profile;
    });
  }

  return selectedProfiles;
}
