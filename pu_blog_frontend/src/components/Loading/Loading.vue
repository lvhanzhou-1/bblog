<template>
	<!-- Spinning Bubbles -->
	<div class="loading-container">
		<div class="loader">
			<div class="loading-spinning-bubbles">
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
				<div class="bubble-container">
					<div class="bubble"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Loading",
};
</script>

<style scoped lang="scss">
.loading-container {
	z-index: 1000;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;

	// height: 100%;
	width: 100%;

	background-color: #fff;

	align-items: center;
	vertical-align: middle;

	.loader {
		margin: 0 auto;
		text-align: center;
		width: 100%;
		min-height: 100%;
		display: table-cell;
		vertical-align: middle;
		opacity: 0.8;

		.loading-spinning-bubbles {
			position: relative;
			margin: auto;
		}
	}
}

.loader * {
	animation-play-state: running;
}

.loading-spinning-bubbles .bubble-container {
	position: absolute;
	top: calc(50% - 10px / 2);
	left: calc(50% - 10px / 2);
	transform-origin: -150% 50%;
}
.loading-spinning-bubbles .bubble-container .bubble {
	margin: 3px;

	background: rgb(201, 77, 77);
	width: 15px;
	height: 15px;
	border-radius: 50%;
	animation: bubble 1s infinite;
	animation-delay: inherit;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 1) {
	transform: translateX(200%) rotate(-90deg);
	animation-delay: -1.5s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 2) {
	transform: translateX(200%) rotate(-45deg);
	animation-delay: -1.375s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 3) {
	transform: translateX(200%);
	animation-delay: -1.25s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 4) {
	transform: translateX(200%) rotate(45deg);
	animation-delay: -1.125s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 5) {
	transform: translateX(200%) rotate(90deg);
	animation-delay: -1s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 6) {
	transform: translateX(200%) rotate(135deg);
	animation-delay: -0.875s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 7) {
	transform: translateX(200%) rotate(180deg);
	animation-delay: -0.75s;
}
.loading-spinning-bubbles .bubble-container:nth-of-type(0n + 8) {
	transform: translateX(200%) rotate(225deg);
	animation-delay: -0.625s;
}

@keyframes bubble {
	0%,
	100% {
		transform: scale(0);
	}
	50% {
		transform: scale(1);
	}
}
</style>
