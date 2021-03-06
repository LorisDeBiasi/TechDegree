/***********************************************************
* Author : De Biasi Loris
* Description : The mutation method class
* Version : 0.1
* Date : 16.06.2017
***********************************************************/

/** Abstract class for mutation method */
class mutation {
	constructor() {
		if (new.target === mutation) {
			throw new TypeError("Cannot construct mutation instances directly");
		}
	}

	process(pNextGenomes) { throw new Error("Must override method"); }
}

/**
 * Mutation class without rate
 * @extends mutation
 */
class mutationWithoutRate extends mutation {
	constructor() {
		// Parent constructor
		super();
	}

	/**
	 * Process the mutation method
     * @param {number} pNextGenomes - A bunch of genomes.
     * @return {genomes} The modified genomes.
	 */
	process(pNextGenomes) {
		var weights = [];

		// Store all the weights in an array
		for (var g = 0; g < pNextGenomes.length; g++) {
			weights.push(pNextGenomes[g].getWeights());
		}

		// Number of values that will change
		var nbValuesToChange;

		// Apply random mutation to each genomes
		for (var genIndex = 0; genIndex < weights.length; genIndex++) {
			// Get the number of values that need to change
			var indexArray = [];
			var alreadyExist;
			nbValuesToChange = Math.floor(Math.random() * (weights[genIndex].length + 1));

			// While we dont have all the index that needs to change
			while (indexArray.length < nbValuesToChange) {
				alreadyExist = false;
				var indexToChange = Math.floor(Math.random() * (weights[genIndex].length + 1));

				// Check if the current index has already been changed
				for (var i = 0; i < indexArray.length; i++) {
					if (indexToChange == indexArray[i]) {
						alreadyExist = true;
					}
				}

				// If the current index hasn't been changed previously
				if (alreadyExist ==  false) {
					indexArray.push(indexToChange)
				}
			}

			// Change the weights randomly
			for (var i = 0; i < indexArray.length; i++) {
				weights[genIndex][indexArray[i]] += Math.random() * 0.4 - 0.2; // [-0.2...0.2]
			}

			// Apply the changes
			pNextGenomes[genIndex].setWeights(weights[genIndex]);
		}

		return pNextGenomes;
	}
}

/**
 * Mutation class with rate
 * @extends mutation
 */
class mutationWithRate extends mutation{
	constructor(pMutationRate) {
		// Parent constructor
		super();

		this.rate = pMutationRate;
	}

	/**
	 * Process the mutation method
     * @param {number} pNextGenomes - A bunch of genomes.
     * @return {genomes} The modified genomes.
	 */
	process(pNextGenomes) {
		var weights = [];

		// Store all the weights in an array
		for (var g = 0; g < pNextGenomes.length; g++) {
			weights.push(pNextGenomes[g].getWeights());
		}

		// Apply random mutation to each genomes
		for (var genIndex = 0; genIndex < weights.length; genIndex++) {

			// Change the weights randomly
			for (var i = 0; i < weights[genIndex].length; i++) {
				if (this.rate <= Math.random()) {
					weights[genIndex][i] += Math.random() * 0.4 - 0.2; // [-0.2...0.2]
				}
			}

			// Apply the changes
			pNextGenomes[genIndex].setWeights(weights[genIndex]);
		}

		return pNextGenomes;
	}
}