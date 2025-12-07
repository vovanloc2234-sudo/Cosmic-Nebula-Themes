/**
 * Cosmic Nebula Theme Demo - JavaScript/TypeScript Example
 * This file demonstrates how the theme looks with various JavaScript constructs
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';

// Constants and variables
const COSMIC_CONSTANT = 42;
const nebulaConfig = {
    name: 'Cosmic Nebula',
    version: '1.0.0',
    colors: ['#7209b7', '#a663cc', '#4c956c', '#5e60ce', '#d94d9a'],
    isActive: true
};

// Class definition
class SpaceExplorer extends EventEmitter {
    constructor(name, ship) {
        super();
        this.name = name;
        this.ship = ship;
        this.coordinates = { x: 0, y: 0, z: 0 };
        this.fuel = 100;
    }

    // Method with async/await
    async exploreNebula(nebulaName) {
        try {
            console.log(`${this.name} is exploring ${nebulaName}...`);
            
            // Simulate space travel
            const travelTime = Math.random() * 1000;
            await this.delay(travelTime);
            
            // Update coordinates
            this.coordinates = {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                z: Math.random() * 1000
            };
            
            this.fuel -= 10;
            this.emit('exploration-complete', {
                explorer: this.name,
                nebula: nebulaName,
                coordinates: this.coordinates,
                fuel: this.fuel
            });
            
            return `Successfully explored ${nebulaName}!`;
        } catch (error) {
            console.error('Exploration failed:', error.message);
            throw new Error(`Failed to explore ${nebulaName}: ${error.message}`);
        }
    }

    // Arrow function
    delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Getter and setter
    get status() {
        if (this.fuel > 50) return 'Ready for exploration';
        if (this.fuel > 20) return 'Low fuel warning';
        return 'Critical fuel level';
    }

    set position(coords) {
        this.coordinates = { ...coords };
    }

    // Static method
    static calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = point1.z - point2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

// Function declarations
function generateStarMap(size = 100) {
    const stars = [];
    
    for (let i = 0; i < size; i++) {
        const star = {
            id: `star-${i}`,
            name: `Star ${i + 1}`,
            type: ['red-giant', 'white-dwarf', 'neutron-star'][Math.floor(Math.random() * 3)],
            brightness: Math.random(),
            coordinates: {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                z: Math.random() * 1000
            }
        };
        stars.push(star);
    }
    
    return stars;
}

// Regular expressions
const coordinatePattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
const starNamePattern = /^[A-Z][a-z]+\s+\d+$/;

// Template literals and destructuring
const createMissionReport = (explorer, mission) => {
    const { name, coordinates, fuel } = explorer;
    const { target, duration, success } = mission;
    
    return `
Mission Report:
===============
Explorer: ${name}
Target: ${target}
Duration: ${duration} hours
Final Position: (${coordinates.x.toFixed(2)}, ${coordinates.y.toFixed(2)}, ${coordinates.z.toFixed(2)})
Remaining Fuel: ${fuel}%
Status: ${success ? '✅ SUCCESS' : '❌ FAILED'}
    `.trim();
};

// Async function with error handling
async function initializeSpaceMission() {
    try {
        const explorer = new SpaceExplorer('Captain Nova', 'USS Nebula');
        const starMap = generateStarMap(50);
        
        // Event listener
        explorer.on('exploration-complete', (data) => {
            console.log('🌟 Exploration completed:', data);
        });
        
        // Multiple explorations
        const nebulae = ['Orion Nebula', 'Crab Nebula', 'Eagle Nebula'];
        const results = await Promise.all(
            nebulae.map(nebula => explorer.exploreNebula(nebula))
        );
        
        // Generate final report
        const mission = {
            target: nebulae.join(', '),
            duration: 24,
            success: results.every(result => result.includes('Successfully'))
        };
        
        const report = createMissionReport(explorer, mission);
        console.log(report);
        
        // Save mission data
        await fs.writeFile('mission-log.json', JSON.stringify({
            explorer: explorer.name,
            starMap,
            results,
            timestamp: new Date().toISOString()
        }, null, 2));
        
    } catch (error) {
        console.error('Mission initialization failed:', error);
    }
}

// Export for module usage
export { SpaceExplorer, generateStarMap, createMissionReport };
export default initializeSpaceMission;

// Self-executing function
(async () => {
    if (typeof window === 'undefined') {
        // Node.js environment
        await initializeSpaceMission();
    } else {
        // Browser environment
        console.log('🚀 Cosmic Nebula Theme loaded in browser');
    }
})();
