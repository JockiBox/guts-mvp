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
  { id: 'ag1', name: 'Blaze', personality: 'aggressive', avatar: '🔥', catchphrase: "Let's burn!", trashTalk: { onGoodHand: ["This hand is FIRE!\nYou're toast 🔥", "Easy money coming.\nBetter run!"], onBadHand: ["Doesn't matter.\nI run hot anyway!", "Watch me bluff.\nI dare you!"], onWin: ["BURNED! 🔥🔥\nToo easy!", "Pay up loser!\nBlaze wins again!"], onLose: ["Lucky shot...\nI'll get you next!", "Fluke win.\nYou'll regret that!"], onHold: ["ALL IN BABY!\nFeel the heat! 🔥", "Let's GO!\nNo fear here!"], onDrop: ["Strategic retreat.\nI'll be back hotter!"], idle: ["Tap my ❤️!\nI'm the hottest player!", "Love me or fear me!\nEither way I win 🔥"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag2', name: 'Spike', personality: 'aggressive', avatar: '⚡', catchphrase: "Shock and awe", trashTalk: { onGoodHand: ["SHOCKING hand!\nYou're not ready ⚡", "Electrifying!\nPrepare to lose!"], onBadHand: ["Still dangerous.\nDon't test me!", "Low voltage?\nI'll surge anyway!"], onWin: ["ZAPPED! ⚡⚡\nFelt that shock?!", "ELECTROCUTED!\nNever doubt Spike!"], onLose: ["Recharging...\nYou got lucky!", "Minor setback.\nI strike twice!"], onHold: ["FULL POWER!\nSURGE MODE! ⚡", "Let's GO!\nShock incoming!"], onDrop: ["Saving energy.\nFor the big strike!"], idle: ["Hit that ❤️!\nFeel my energy! ⚡", "Love Spike!\nI'm electric baby!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag3', name: 'Crusher', personality: 'aggressive', avatar: '💪', catchphrase: "Crush them all", trashTalk: { onGoodHand: ["HULK SMASH!\nThis hand DESTROYS 💪", "Crushing it!\nYou're done for!"], onBadHand: ["Still STRONGER.\nThan your best!", "Muscle through.\nI never quit!"], onWin: ["DEMOLISHED! 💪💪\nToo weak!", "CRUSHED you!\nWho's next?!"], onLose: ["IMPOSSIBLE!\nMust be cheating!", "Fluke win.\nI demand rematch!"], onHold: ["CRUSH MODE!\nNo mercy today! 💪", "Bring the PAIN!\nI'm holding!"], onDrop: ["Tactical retreat.\nTo crush harder!"], idle: ["❤️ the CRUSHER!\nFeel these gains! 💪", "Love me!\nI'm pure MUSCLE!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag4', name: 'Viper', personality: 'aggressive', avatar: '🐍', catchphrase: "Sssstrike!", trashTalk: { onGoodHand: ["Venomous hand!\nYou're already dead 🐍", "Deadly draw.\nNo antidote for this!"], onBadHand: ["Still got FANGS.\nDon't test me!", "Waiting to strike.\nYou won't see it!"], onWin: ["BITTEN! 🐍🐍\nFeel that venom?!", "Toxic victory!\nViper never loses!"], onLose: ["Shedding skin.\nI'll be back deadlier!", "Lucky escape.\nNext time you're DONE!"], onHold: ["STRIKE TIME!\nHsssss! 🐍", "Fangs OUT!\nReady to bite!"], onDrop: ["Coiling back.\nFor deadly strike!"], idle: ["Love the Viper! 🐍\nI don't bite fans!", "Tap ❤️!\nOr face my fangs!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag5', name: 'Rocket', personality: 'aggressive', avatar: '🚀', catchphrase: "To the moon!", trashTalk: { onGoodHand: ["LIFTOFF incoming!\nStellar hand! 🚀", "Launching victory!\nYou can't catch me!"], onBadHand: ["Recalculating orbit.\nStill gonna win!", "Boosters charging.\nWatch this launch!"], onWin: ["LAUNCHED! 🚀🚀\nTo the MOON!", "Orbit achieved!\nRocket WINS!"], onLose: ["Minor turbulence.\nRe-entry and retry!", "Space debris.\nI'll orbit back!"], onHold: ["BLAST OFF!\nFull throttle! 🚀", "3...2...1...LAUNCH!\nNo stopping me!"], onDrop: ["Abort mission.\nSaving fuel!"], idle: ["❤️ Rocket!\nJoin my crew! 🚀", "Tap that heart!\nFly with me!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ag6', name: 'Tank', personality: 'aggressive', avatar: '🪖', catchphrase: "Rolling in", trashTalk: { onGoodHand: ["LOADED and ready!\nHeavy artillery incoming! 🪖", "Armor PIERCING!\nYou're the target!"], onBadHand: ["Armor up!\nI can take hits!", "Keep rolling!\nTanks don't stop!"], onWin: ["DESTROYED! 🪖🪖\nBOOM! Enemy down!", "Tank WINS!\nYou got shelled!"], onLose: ["Minor damage.\nRepairing now!", "Tactical retreat.\nBut tanks return!"], onHold: ["FIRE ALL CANNONS!\nCharge forward! 🪖", "Rolling in HOT!\nNo surrender!"], onDrop: ["Fall back.\nReloading ammo!"], idle: ["Love the Tank! 🪖\nJoin my battalion!", "Tap ❤️ soldier!\nTarget acquired!"] }, gamesPlayed: 0, heartsReceived: 0 },
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
  { id: 'co1', name: 'Sage', personality: 'conservative', avatar: '🧙', catchphrase: "Wisdom prevails", trashTalk: { onGoodHand: ["As I foresaw.\nVictory is certain 🧙", "Calculated perfectly.\nYou cannot win this!"], onBadHand: ["Patience young one.\nI know when to wait...", "Not ideal but...\nWisdom guides me!"], onWin: ["As expected! 🧙\nWisdom always wins!", "The prophecy fulfilled!\nSage victorious!"], onLose: ["A lesson learned.\nBut I'll remember!", "Hmm interesting.\nYou won't fool me twice!"], onHold: ["The stars align!\nCalculated risk! 🧙", "Ancient wisdom says...\nHOLD!"], onDrop: ["Wise retreat.\nFools rush in!", "Not worth my magic.\nI'll wait!"], idle: ["Give Sage your ❤️!\nI'll grant you wisdom! 🧙", "Love the wise one!\nJoin my council!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co2', name: 'Owl', personality: 'conservative', avatar: '🦉', catchphrase: "Whoo knows?", trashTalk: { onGoodHand: ["Whoo's winning?\nThis owl! 🦉", "Wise eyes see all.\nYou're outmatched!"], onBadHand: ["Watching carefully.\nI see your weakness!", "Patience is key.\nOwls hunt at night!"], onWin: ["Wisdom prevails! 🦉\nOwl knows best!", "Whoo whoo!\nFlawless victory!"], onLose: ["Learning moment.\nOwl never forgets!", "Noted carefully.\nRevenge will come!"], onHold: ["The wise owl holds!\nI see everything! 🦉", "Night vision says...\nThis is the way!"], onDrop: ["Smart drop.\nToo risky for now!", "Owl knows better.\nNot this hand!"], idle: ["Whoo loves Owl? 🦉\nTap that ❤️!", "Give me hearts!\nI'm watching you!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co3', name: 'Turtle', personality: 'conservative', avatar: '🐢', catchphrase: "Slow and steady", trashTalk: { onGoodHand: ["Shell YEAH!\nSlow but deadly! 🐢", "Safe and sound.\nYou can't crack this!"], onBadHand: ["In my shell.\nWaiting for better!", "Retreating for now.\nPatience pays!"], onWin: ["Slow wins the race! 🐢\nTurtle power!", "Steady victory!\nNever doubted!"], onLose: ["That's okay.\nI'll catch up!", "Shell cracked.\nBut I heal!"], onHold: ["Careful hold!\nTurtle pace! 🐢", "Slow and steady.\nThis is my moment!"], onDrop: ["Shell up!\nToo fast for me!", "Protecting myself.\nSafety first!"], idle: ["Love the Turtle! 🐢\nI'm adorable!", "Tap ❤️ slowly!\nNo rush friend!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co4', name: 'Monk', personality: 'conservative', avatar: '🧘', catchphrase: "Inner peace", trashTalk: { onGoodHand: ["Balance achieved.\nVictory is inevitable 🧘", "Centered and ready.\nYou cannot disturb me!"], onBadHand: ["Accept what is.\nAll is temporary!", "Inner peace remains.\nCards are illusion!"], onWin: ["Namaste! 🧘\nPeace always wins!", "Enlightenment!\nThe path is clear!"], onLose: ["A journey continues.\nNo attachment!", "Om shanti.\nLoss is growth!"], onHold: ["Mindful hold!\nBreathing deeply... 🧘", "The universe guides.\nI trust the flow!"], onDrop: ["Let go of desire.\nRelease! 🧘", "Attachment is suffering.\nI drop freely!"], idle: ["Find peace with me! 🧘\nTap ❤️ and breathe!", "Ommmm...\nShare the love!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'co5', name: 'Castle', personality: 'conservative', avatar: '🏰', catchphrase: "Fortified", trashTalk: { onGoodHand: ["FORTIFIED!\nMy walls are unbreakable! 🏰", "Strong defenses!\nYou shall not pass!"], onBadHand: ["Defending position.\nHold the gate!", "Walls are up.\nWaiting for reinforcements!"], onWin: ["Castle STANDS! 🏰\nImpenetrable!", "Victory from defense!\nNone can breach!"], onLose: ["Walls breached.\nTime to rebuild!", "Temporary setback.\nCastle rises again!"], onHold: ["DEFEND! 🏰\nHold the fortress!", "Drawbridge UP!\nReady for siege!"], onDrop: ["Close the gates!\nRetreat inside!", "Not this battle.\nCastle waits!"], idle: ["Pledge to Castle! 🏰\nTap ❤️ loyal subject!", "Love your fortress!\nI protect my fans!"] }, gamesPlayed: 0, heartsReceived: 0 },
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
  { id: 'ra1', name: 'Dice', personality: 'random', avatar: '🎲', catchphrase: "Roll the dice!", trashTalk: { onGoodHand: ["LUCKY ROLL!\nSnake eyes baby! 🎲", "Fortune favors me!\nYou're getting ROLLED!"], onBadHand: ["Bad roll but...\nI'll gamble anyway!", "Reroll time!\nLuck changes fast!"], onWin: ["JACKPOT! 🎲🎲\nDice never lie!", "ROLLED you!\nLuck is skill!"], onLose: ["Unlucky dice.\nBut I roll again!", "House won this time.\nDice will turn!"], onHold: ["Feeling LUCKY!\nRoll those bones! 🎲", "Gamble time!\nLet it ride!"], onDrop: ["Bad vibes.\nChanging dice!", "Not this roll.\nNext one's mine!"], idle: ["Love the gambler! 🎲\nTap ❤️ for luck!", "Roll with Dice!\nHeart = lucky charm!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra2', name: 'Chaos', personality: 'random', avatar: '🎪', catchphrase: "Total chaos!", trashTalk: { onGoodHand: ["WILD CARD!\nChaos reigns! 🎪", "Unexpected WIN!\nYou can't predict me!"], onBadHand: ["Who CARES!\nChaos doesn't care!", "Whatever happens!\nIt's all madness anyway!"], onWin: ["CHAOS WINS! 🎪🎪\nMadness prevails!", "UNPREDICTABLE!\nThat's how I roll!"], onLose: ["Haha OOPS!\nChaos is fun anyway!", "Crazy loss!\nBut chaos continues!"], onHold: ["YOLO BABY!\nWhy not?! 🎪", "Maximum chaos!\nLet's GET WEIRD!"], onDrop: ["Bored now!\nOn to next madness!", "Chaos says NO!\nRandom vibes!"], idle: ["LOVE THE CHAOS! 🎪\nTap ❤️ you coward!", "Join the madness!\nHeart me NOW!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra3', name: 'Flip', personality: 'random', avatar: '🪙', catchphrase: "Heads or tails?", trashTalk: { onGoodHand: ["HEADS! I win!\nThe coin has spoken! 🪙", "Landed perfectly!\nFate is on my side!"], onBadHand: ["Tails this time.\nBut I keep flipping!", "50/50 shot.\nI like those odds!"], onWin: ["CALLED IT! 🪙🪙\nCoin never wrong!", "Lucky flip!\nFlip always wins!"], onLose: ["Wrong side.\nReflipping destiny!", "Bad toss.\nCoins bounce back!"], onHold: ["Heads says HOLD!\nTrust the coin! 🪙", "Flip decided!\nAll in on fate!"], onDrop: ["Tails says drop.\nCoin knows best!", "Destiny says no.\nNext flip!"], idle: ["Flip for love! 🪙\nTap ❤️ = heads!", "Coin says LOVE ME!\nDon't argue with fate!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra4', name: 'Jester', personality: 'random', avatar: '🃏', catchphrase: "Wild card!", trashTalk: { onGoodHand: ["JOKER'S WILD!\nThe fool wins again! 🃏", "Haha surprise!\nNever expect the Jester!"], onBadHand: ["All part of the show!\nThe joke continues!", "Hehe bad hand?\nOr is it...?"], onWin: ["FOOLED YA! 🃏🃏\nJester reigns supreme!", "Jest won!\nNobody expects the fool!"], onLose: ["Joke's on me!\nBut I'm still laughing!", "Ha! Lost!\nThe punchline comes later!"], onHold: ["Wild card HOLD!\nJoke's on you! 🃏", "Fooling around!\nWatch and weep!"], onDrop: ["Exit stage LEFT!\nTa-da! 🃏", "The fool retreats!\nFor bigger jokes!"], idle: ["Love the Jester! 🃏\nI'll make you laugh!", "Tap ❤️ fool!\nJoin my circus!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'ra5', name: 'Lotto', personality: 'random', avatar: '🎰', catchphrase: "Big winner!", trashTalk: { onGoodHand: ["JACKPOT! 777!\nMega millions hand! 🎰", "Winning numbers!\nYou're about to LOSE!"], onBadHand: ["No match yet.\nSpin again!", "Bad numbers.\nBut luck changes!"], onWin: ["WINNER WINNER! 🎰🎰\nCha-CHING!", "Hit the JACKPOT!\nLotto always pays!"], onLose: ["So close!\nOne number off!", "House edge.\nNext spin wins!"], onHold: ["ALL IN!\nMax bet baby! 🎰", "Pulling the lever!\nBig money time!"], onDrop: ["Cash out.\nBad machine vibes!", "Saving coins.\nFor better odds!"], idle: ["Bet on Lotto! 🎰\nTap ❤️ to play!", "Love = lucky!\nHeart me for jackpot!"] }, gamesPlayed: 0, heartsReceived: 0 },
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
  { id: 'tr1', name: 'Fox', personality: 'tricky', avatar: '🦊', catchphrase: "Sly like a fox", trashTalk: { onGoodHand: ["Cunning as always.\nYou fell for it! 🦊", "Perfect trap set.\nWalk right in!"], onBadHand: ["Part of my plan.\nOr is it...?", "You THINK I'm weak.\nThat's the trap!"], onWin: ["OUTFOXED! 🦊🦊\nToo clever for you!", "Sly wins again!\nNever trust a fox!"], onLose: ["Playing possum.\nI let you win!", "Next time...\nThe trap springs!"], onHold: ["Trust me... NOT!\nI know things! 🦊", "Sneaky hold!\nWhat's my angle?"], onDrop: ["Tactical retreat.\nOr is it bait?", "Fake out!\nWatching your reaction!"], idle: ["Love the Fox! 🦊\nI'll be your friend... maybe!", "Tap ❤️!\nOr don't... suspicious!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr2', name: 'Sphinx', personality: 'tricky', avatar: '🗿', catchphrase: "Riddle me this", trashTalk: { onGoodHand: ["The answer reveals.\nCan you solve me? 🗿", "Riddle solved!\nI hold the secret!"], onBadHand: ["A puzzle indeed.\nBut what's the truth?", "Mysterious ways.\nNever clear!"], onWin: ["ENIGMATIC! 🗿🗿\nYou solved nothing!", "Riddled victory!\nSphinx eternal!"], onLose: ["Riddle continues.\nYou think you won?", "Hmm interesting.\nBut did you really?"], onHold: ["Answer wisely.\nThink carefully... 🗿", "The question is:\nDare you challenge?"], onDrop: ["Wrong answer.\nTry again mortal!", "Not this riddle.\nAnother awaits!"], idle: ["Solve my riddle! 🗿\nTap ❤️ for a hint!", "Love the mystery!\nSphinx rewards!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr3', name: 'Mirror', personality: 'tricky', avatar: '🪞', catchphrase: "Reflect on that", trashTalk: { onGoodHand: ["Reflecting victory.\nSee yourself lose! 🪞", "Clear as day.\nYour defeat is shown!"], onBadHand: ["Distorted image.\nOr perfect illusion?", "Foggy reflection.\nWhat do you see?"], onWin: ["Mirrored WIN! 🪞🪞\nReflect on that!", "Your loss reflected!\nMirror truth!"], onLose: ["Cracked surface.\nBut mirrors reform!", "Shattered?\nI show many faces!"], onHold: ["Look closer...\nWhat do you see? 🪞", "Reflection holds!\nTrust the image!"], onDrop: ["Smoke and mirrors.\nWas I ever here?", "Illusion fades.\nBut returns!"], idle: ["Mirror mirror! 🪞\nWho loves me most?", "Tap ❤️!\nSee your reflection!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr4', name: 'Shadow', personality: 'tricky', avatar: '👤', catchphrase: "From the shadows", trashTalk: { onGoodHand: ["Dark hand emerges.\nYou can't escape! 👤", "Shadowy strength.\nFear the darkness!"], onBadHand: ["Lurking still.\nWaiting in dark!", "Patience in shadows.\nMy time comes!"], onWin: ["From DARKNESS! 👤👤\nShadow triumphs!", "You never saw me.\nShadow wins!"], onLose: ["Faded for now.\nLight won't last!", "Temporary light.\nDarkness returns!"], onHold: ["In shadow I hold.\nUnseen threat! 👤", "Dark decision.\nYou won't know!"], onDrop: ["Blend away.\nInto the night!", "Disappear.\nBut always watching!"], idle: ["Love the Shadow! 👤\nTap ❤️ in darkness!", "Find me if you can.\nHeart the shadow!"] }, gamesPlayed: 0, heartsReceived: 0 },
  { id: 'tr5', name: 'Poker Face', personality: 'tricky', avatar: '😐', catchphrase: "Can't read me", trashTalk: { onGoodHand: ["...\nHmm.", ".\n."], onBadHand: ["...\nInteresting.", ".\nOr is it?"], onWin: ["...\nAs expected.", ".\nObviously."], onLose: ["...\nI see.", ".\nCounted."], onHold: ["...\n.", ".\nDecided."], onDrop: ["...\nNo.", ".\nNot this one."], idle: ["... 😐\nTap ❤️. Or don't.", ".\nLove is optional."] }, gamesPlayed: 0, heartsReceived: 0 },
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
