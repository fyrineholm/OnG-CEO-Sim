<script lang="ts">
	export function id(idg: string) {
		return document.getElementById(idg);
	}
	export function hide(element: HTMLElement) {
		element.classList.add("hidden");
	}
	export function show(element: HTMLElement) {
		element.classList.remove("hidden");
	}
	export function applyChange(e: HTMLElement, change: number) {
		if (change > 0) {
			e.classList.add("green");
			e.classList.remove("red");
		} else if (change == 0) {
			e.classList.remove("red");
			e.classList.remove("green");
		} else {
			e.classList.add("red");
			e.classList.remove("green");
		}
	}
	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	let playthroughs: number = $state(
		parseInt(localStorage.getItem("playthroughs") || "0"),
	);
	function updateChoices() {
		if (
			localStorage.getItem("playthroughs") == null ||
			localStorage.getItem("playthroughs")!.length < 1
		) {
			console.log(
				"error, playthroughs store invalid. reading: ",
				localStorage.getItem("playthroughs"),
				". resetting value to 0.",
			);
			localStorage.setItem("playthroughs", "0");
			playthroughs = parseInt(
				localStorage.getItem("playthroughs") || "0",
			);
			updateChoices();
		} else {
			if (playthroughs < 1) hide(id("fin")!);
			else show(id("fin")!);
			if (playthroughs < 2) hide(id("mna")!);
			else show(id("mna")!);
			if (playthroughs < 3) hide(id("cha")!);
			else show(id("cha")!);
			if (playthroughs < 4) hide(id("rnd")!);
			else show(id("rnd")!);
			if (playthroughs < 5) hide(id("exh")!);
			else show(id("exh")!);
		}
	}
	// <input type="radio" name="char" value="fin" id="fin" />
	// Flurry Ouchsloss, Financial specialist: lower interest rate on debt,
	// lower operating costs<br />
	// <input type="radio" name="char" value="mna" id="mna" />
	// T Boone Flickens, M&A specialist: bonus in M&A cost reduction in
	// deals, 25% bonus cost reduction on CAPEX for SMR and Solar<br />
	// <input type="radio" name="char" value="cha" id="cha" />
	// Flex Tillerson, The Charmer: bonus to shareholder sentiment, reduction
	// in lawsuit and SEC investigation probability<br />
	// <input type="radio" name="char" value="rnd" id="rnd" />
	// Dr Amin Flasser, R&D Specialist: OPEX reduction for R&D<br />
	// <input type="radio" name="char" value="exh" id="exh" />
	// Patrick Pouflan, Ex-hacker and automation expert: reduction in operating
	// costs, saves 50% on cyber costs<br />
	let charCode = {
		gen: "Darren Floods, generalist",
		fin: "Flurry Ouchsloss, Financial specialist",
		mna: "T Boone Flickens, M&A specialist",
		cha: "Flex Tillerson, The Charmer",
		rnd: "Dr Amin Flasser, R&D Specialist",
		exh: "Patrick Pouflan, Ex-hacker and automation expert",
	};
	let month: number = $state(1);
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let oilPrice: number = $state(60);
	let cash: number = $state(1300000000);
	let debt: number = $state(13000000000);
	let revenue: number = $state(0);
	let production: number = $state(0);
	let operatingCost: number = $state(0);
	let cyberRisk: number = $state(0.2);
	let rigs: number = $state(20);
	let spills: number = $state(0);
	let rigsInUse: number = $state(0);
	let wells: number = $state(410);
	let hacks: number = $state(0);
	let fatalities: number = $state(0);
	let shareholderSentiment: number = $state(100);
	let char: "gen" | "fin" | "mna" | "cha" | "rnd" | "exh" = $state("gen");
	let sharePrice: number = $state(150.0);
	let interestRate: number = $state(0.01);
	let operatingCostMultiplier: number = $state(1.0);
	let mergerCostMultiplier: number = $state(1.0);
	let capexCostMultiplier: number = $state(1.0);
	let shareholderSentimentMultiplier: number = $state(1.0);
	let revenueMultiplier: number = $state(1.0);
	let rndCostMultiplier: number = $state(1.0);
	let lawsuitInvestigationMultiplier: number = $state(1.0);
	let cyberCostMultiplier: number = $state(1.0);

	let rndhdBought: boolean = $state(false);
	let rnddeBought: boolean = $state(false);
	let monitorBought: boolean = $state(false);
	let vpnBought: boolean = $state(false);

	const incrementMonth = () => {
		month += 1;
	};
	export function scene1() {
		hide(id("scene1")!);
		show(id("scene2")!);
		updateChoices();
	}
	export function scene2() {
		let newChar = (<HTMLInputElement>(
			document.querySelector('input[name="char"]:checked')
		)).value;
		const allowedChars = ["gen", "fin", "mna", "cha", "rnd", "exh"];
		if (
			newChar != null &&
			newChar != undefined &&
			allowedChars.includes(newChar)
		) {
			char = newChar as "gen" | "fin" | "mna" | "cha" | "rnd" | "exh";
		} else {
			alert("invalid selection");
			return;
		}
		hide(id("scene2")!);
		//reset numbers from prior character selection
		let switchConfirm = true;
		interestRate = 0.01;
		operatingCostMultiplier = 1.0;
		rndCostMultiplier = 1.0;
		capexCostMultiplier = 1.0;
		cyberCostMultiplier = 1.0;
		mergerCostMultiplier = 1.0;
		lawsuitInvestigationMultiplier = 1.0;
		shareholderSentimentMultiplier = 1.0;
		if (newChar == "fin") {
			interestRate = 0.0075;
			operatingCostMultiplier = 0.99;
		} else if (newChar == "mna") {
			mergerCostMultiplier = 0.75;
			capexCostMultiplier = 0.75;
		} else if (newChar == "cha") {
			shareholderSentimentMultiplier = 1.1;
			lawsuitInvestigationMultiplier = 0.5;
		} else if (newChar == "rnd") {
			rndCostMultiplier = 0.5;
		} else if (newChar == "exh") {
			operatingCostMultiplier = 0.98;
			cyberCostMultiplier = 0.5;
		} else if (newChar == "gen") {
		} else {
			switchConfirm = false;
			alert(
				"invalid char identifier " +
					newChar +
					" at eval multipliers scene 2-3 transition",
			);
		}
		if (switchConfirm) {
			show(id("scene3")!);
		} else {
			show(id("scene2")!);
		}
	}
	function drill() {
		if (rigs - rigsInUse < 1) return;
		wells += 10;
		if (cash > 10000000) {
			cash -= 10000000;
		} else {
			debt += 10000000;
		}
		rigsInUse += 1;
	}
	function buyRig() {
		rigs += 1;
		if (cash > 50000000 * rndCostMultiplier) {
			cash -= 50000000 * rndCostMultiplier;
		} else {
			debt += 50000000 * rndCostMultiplier;
		}
	}
	function sellRig() {
		rigs -= 1;
		cash += 50000000 * (1 / rndCostMultiplier);
	}
	function buyback() {
		cash -= 1000000000;
		sharePrice *= 1.05;
		shareholderSentiment += 10;
		shareholderSentimentMultiplier = 1.01;
	}
	function repayDebt() {
		cash -= 1000000000;
		debt -= 1000000000;
	}
	function rndhd() {
		revenueMultiplier *= 1.2;
		if (cash > 50000000 * rndCostMultiplier) {
			cash -= 50000000 * rndCostMultiplier;
		} else {
			debt += 50000000 * rndCostMultiplier;
		}
		rndhdBought = true;
	}
	function takeLoan() {
		cash += 1000000000;
		debt += 1000000000;
	}
	function addDiv() {
		shareholderSentiment += 20;
		shareholderSentimentMultiplier *= 1.1;
		revenueMultiplier *= 0.85;
	}
	function buyVpn() {
		vpnBought = true;
		if (cash > 20000000 * cyberCostMultiplier) {
			cash -= 20000000 * cyberCostMultiplier;
		} else {
			debt += 20000000 * cyberCostMultiplier;
		}
		cyberRisk *= 1.3;
	}
	function buyMonitor() {
		monitorBought = true;
		if (cash > 20000000 * cyberCostMultiplier) {
			cash -= 20000000 * cyberCostMultiplier;
		} else {
			debt += 20000000 * cyberCostMultiplier;
		}
		cyberCostMultiplier *= 0.5;
	}
	function cutDiv() {
		shareholderSentiment -= 20;
		shareholderSentimentMultiplier *= 0.87;
		revenueMultiplier *= 1.12;
	}
	function rndde() {
		revenueMultiplier *= 1.2;
		if (cash > 150000000 * rndCostMultiplier) {
			cash -= 150000000 * rndCostMultiplier;
		} else {
			debt += 150000000 * rndCostMultiplier;
		}
		rnddeBought = true;
	}
	function penTest() {
		cash -= 5000000;
		cyberRisk *= 0.99;
	}
	function cullWell() {
		wells -= 1;
		operatingCostMultiplier *= 0.985;
		if (cash > 2000000) {
			cash -= 2000000;
		} else {
			debt += 2000000;
		}
	}
	async function nextTurn() {
		rigsInUse = 0;
		hide(id("actions")!);
		await sleep(250);
		let oilCompl = Math.floor(Math.random() * 11) - 5;
		oilPrice += oilCompl; // -5 to +5
		if (oilPrice < 20) oilPrice = 20;
		else if (oilPrice > 200) oilPrice = 200;
		applyChange(id("oil-price")!, oilCompl);
		await sleep(250);
		let shareCompl = (oilPrice - 60) * 0.05 + (Math.random() - 0.5) * 2;
		sharePrice += shareCompl;
		if (sharePrice < 20) sharePrice = 20;
		shareholderSentiment =
			shareholderSentiment * shareholderSentimentMultiplier;
		applyChange(id("share-price")!, shareCompl);
		await sleep(250);
		incrementMonth();
		await sleep(250);
		applyChange(id("net-oil-production")!, wells * 7500 - production);
		production = wells * 7500;
		await sleep(250);
		let newOpCost = wells * 2600000 * operatingCostMultiplier;
		applyChange(id("operating-costs")!, operatingCost - newOpCost);
		if (debt > 0) {
			debt = debt * 2;
			applyChange(id("debt")!, -1);
			await sleep(250);
		}
		let newRev = oilPrice * 0.75 * production * revenueMultiplier;
		applyChange(id("revenue")!, newRev - revenue);
		revenue = newRev;
		await sleep(250);
		let cashCompl = revenue - operatingCost;
		applyChange(id("cash")!, cashCompl);
		cash = cash + cashCompl;
		//cyber event logic
		if (Math.random() < cyberRisk) {
			show(id("hacked")!);
			if (monitorBought) {
				cash *= 0.5;
				revenue *= 0.5;
				debt *= 1.2;
				shareholderSentiment *= 0.8;
				revenueMultiplier *= 0.8;
			} else {
				cash = 0;
				revenue = 0;
				debt *= 3;
				shareholderSentiment *= 0.75;
				revenueMultiplier *= 0.75;
			}
			await sleep(9000);
			hide(id("hacked")!);
		}
		//tragic accident logic
		if (Math.random() < 0.1) {
			show(id("tragic")!);
			cash = 0;
			wells -= 1;
			revenueMultiplier *= 0.9;
			shareholderSentiment *= 0.85;

			await sleep(9000);
			hide(id("tragic")!);
		}
		//oil spill logic
		if (Math.random() < 0.1) {
			show(id("spill")!);
			cash = 0;
			wells -= 1;
			revenueMultiplier *= 0.9;
			shareholderSentiment *= 0.95;

			await sleep(9000);
			hide(id("spill")!);
		}
		//investor panic event
		if (Math.random() < 0.1) {
			show(id("panic")!);
			shareholderSentiment *= 0.65;
			await sleep(9000);
			hide(id("panic")!);
		}
		// Add any additional end-of-turn logic here (events, win/loss, etc)
		if (month == 12) {
			hide(id("scene4")!);
			show(id("scene5")!);
		} else if (shareholderSentiment < 50 || debt > 15000000000) {
			hide(id("scene4")!);
			show(id("scene6")!);
		}
		await sleep(3000);
		show(id("actions")!);
	}
</script>

<main>
	Landman game iteration 2 - Playthrough {playthroughs + 1}
	<hr />
	<div id="game">
		<div id="scene1">
			<p>
				You have just become the CEO of Bexvronback Phillips, an oil and
				gas company focusing on upstream oil and gas, based in Houston
				TX with wells 410 wells spread throughout the Permian basin.<br
				/>
				Getting this job is very exciting but the euphoria is wearing off
				quickly as it was just announced that the Permian basin hit peak
				oil, such that production will start to decline for the entire basin
				over time, until depletion.
			</p>
			<button onclick={scene1}>Start</button>
		</div>
		<div id="scene2" class="hidden">
			<p>Choose your character:</p>
			<ul>
				<input type="radio" name="char" value="gen" />
				Darren Floods, Generalist: no bonuses or penalties<br />
				<input type="radio" name="char" value="fin" id="fin" />
				Flurry Ouchsloss, Financial specialist: lower interest rate on debt,
				lower operating costs<br />
				<input type="radio" name="char" value="mna" id="mna" />
				T Boone Flickens, M&A specialist: bonus in M&A cost reduction in
				deals, 25% bonus cost reduction on CAPEX for SMR and Solar<br />
				<input type="radio" name="char" value="cha" id="cha" />
				Flex Tillerson, The Charmer: bonus to shareholder sentiment, reduction
				in lawsuit and SEC investigation probability<br />
				<input type="radio" name="char" value="rnd" id="rnd" />
				Dr Amin Flasser, R&D Specialist: OPEX reduction for R&D<br />
				<input type="radio" name="char" value="exh" id="exh" />
				Patrick Pouflan, Ex-hacker and automation expert: reduction in operating
				costs, saves 50% on cyber costs<br />
				<button onclick={scene2}>select</button>
			</ul>
		</div>
		<div id="scene3" class="hidden">
			Are you sure you want to play as {charCode[char]}?
			<button
				onclick={async () => {
					hide(id("scene3")!);
					await sleep(150);
					show(id("scene3b")!);
					await sleep(5000);
					hide(id("scene3b")!);
					await sleep(150);
					show(id("scene4")!);
				}}>Yes</button
			>
			<button
				onclick={() => {
					hide(id("scene3")!);
					show(id("scene2")!);
				}}>No</button
			>
		</div>
		<div id="scene3b" class="hidden">
			The game starts with the price of oil being $60/bbl of WTI crude
			(which delivers an average revenue per BOE (barrel oil equivalent)
			of $45 or 75% of the WTI price), the company having 20 rigs and 410
			wells drilled with a stock price of $150/share with 300 million
			shares outstanding trailing 12 months revenue of $10b and $3.6b in
			earnings with EPS of $12.0. Additionally there is a shareholder
			sentiment figure of 100. If this drops below 50 after a quarter the
			CEO will be fired. Debt is currently at $13b. Free cash flow is
			$1.3b with Capex at $900m. Annual dividend is 4.0% (or $6/share).
			Production in the previous year was 600MBO/d (600,000 bbl/day). The
			new CEO needs to steer the company through these trying times.
		</div>
		<div id="scene4" class="hidden">
			<div id="statrow1">
				<div id="oil-price">Oil price: ${oilPrice} per bbl</div>
				<div id="share-price">Share price: ${sharePrice}</div>
				<div id="month">{monthNames[month - 1]}</div>
				<div id="net-oil-production">
					Net oil production: {production}BOE/d
				</div>
				<div id="operating-costs">
					Operating costs: ${operatingCost *
						operatingCostMultiplier}/mo
				</div>
				{#if debt > 0}<div id="debt">Debt: {debt}</div>{/if}
				<div id="revenue">Revenue: ${revenue}/mo</div>
				<div id="cash">Cash: ${cash}</div>
			</div>
			<div id="statrow2">
				{#if spills > 0}<div>Spills: {spills}</div>{/if}
				{#if fatalities > 0}<div>Blowouts: {fatalities}</div>{/if}
				{#if fatalities > 0}<div>Fatalities: {fatalities}</div>{/if}
				<div>Rigs in use: {rigsInUse}/{rigs}</div>
				<div>Wells: {wells}</div>
				{#if hacks > 0}<div>Hacks: 0</div>{/if}
				<div>Percent of wells vulnerable: 100%</div>
				<div>SEC investigating: No</div>
				<div>Lawsuit: No</div>
			</div>
			<div id="hacked" class="hidden">
				<br />
				<h3>Hacked!</h3>
				<br />
				<p>
					Your company has been <b>hacked</b>! Your operations for
					this month have been heavily impacted and your revenue was
					heavily impacted. You used all your available funds to
					recover, but shareholders are very anxious. You financial
					situation has worsened considerably.
				</p>
				<br />
				<br />
			</div>
			<div id="tragic" class="hidden">
				<br />
				<h3>A tragic accident!</h3>
				<br />
				<p>
					One of your workers on the fields was killed in a brutal and
					tragic well explosion. You paid out your funds to the
					victim's family. Other workers are anxious, and this has
					reduced operating efficiency. Shareholders are not happy
					about this either.
				</p>
				<br />
				<br />
			</div>
			<div id="spill" class="hidden">
				<br />
				<h3>Environmental catastrophe!</h3>
				<br />
				<p>
					One of your wells was discovered to have had a leak! This
					well has been leaking into the ground, contaminating the
					environment for who knows how long. The nearby residents are
					furious, and protesting near the site has affected revenues.
					Some workers are ashamed or afraid to come to work.
					Shareholders are uncomfortable. The government has forced
					you to clean up the mess and pay out a settlement to the
					nearby communities, costing all your available funds! about
					this either.
				</p>
				<br />
				<br />
			</div>
			<div id="actions">
				<button onclick={cullWell} disabled={cash < 2000000}
					>cull worst-performing well - $2m</button
				>
				<button
					onclick={buyRig}
					disabled={cash < 50000000 * rndCostMultiplier}
					>buy new rig - ${50 * rndCostMultiplier}m</button
				>
				<button onclick={sellRig} disabled={rigsInUse >= rigs}
					>sell rig - +${50 * rndCostMultiplier}m</button
				>
				<button onclick={drill}>drill well - $2.6m</button>
				{#if !rndhdBought}<button
						onclick={rndhd}
						disabled={cash < 50000000}
						>R&D: horizontal drilling - $50m</button
					>{/if}
				{#if !rnddeBought && rndhdBought}<button
						onclick={rndde}
						disabled={cash < 150000000 * rndCostMultiplier}
						>R&D: deeper extraction - ${150 *
							rndCostMultiplier}m</button
					>{/if}
				{#if debt > 0}<button
						onclick={repayDebt}
						disabled={cash < 1000000000}
						>Finances: repay $1bn debt</button
					>{/if}
				<button onclick={buyback} disabled={cash < 1000000000}
					>Finances: Buyback $1bn stock</button
				>
				<button onclick={takeLoan} disabled={shareholderSentiment < 60}
					>Finances: Take out loan - +$1bn cash, +$1bn debt</button
				>
				<button onclick={addDiv} disabled={cash < 1000000000}
					>Finances: Expand dividends -$1bn revenue, +shareholder
					sentiment</button
				>
				<button onclick={cutDiv}
					>Finances: Cut dividends +$1bn revenue, -shareholder
					sentiment</button
				>
				{#if !vpnBought}<button onclick={buyVpn}
						>Cybersecurity: Invest in VPN - $20m</button
					>{/if}
				{#if !monitorBought}<button onclick={buyMonitor}
						>Cybersecurity: Invest in monitoring - $10m</button
					>{/if}
				{#if monitorBought || vpnBought}<button
						onclick={penTest}
						disabled={cash < 5000000}
						>Cybersecurity: Conduct pen test - $5m</button
					>{/if}
				<button onclick={buyMonitor}
					>Cybersecurity: Invest in BlastShield, a network cloaking
					solution with built-in MFA and segmentation which
					accomplishes secure remote access, micro-segmentation,
					protects legacy systems that can't be patched by requiring
					passwordless MFA before gaining visibility or access to
					specific assets - $10m</button
				>
				<button onclick={nextTurn}>end turn</button>
			</div>
		</div>
		<div id="scene5" class="hidden">
			<span>You survived the year</span>
			<span>Final share price: {sharePrice}</span>
		</div>
		<div id="scene6" class="hidden">
			<span>You didn't make it through the year!</span>
			<span>Final share price: {sharePrice}</span>
			<span>Final debt: {debt}</span>
			<span>Final shareholder sentiment: {shareholderSentiment}</span>
		</div>
	</div>
</main>
