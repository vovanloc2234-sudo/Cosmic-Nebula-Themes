#!/usr/bin/env python3
"""
Cosmic Nebula Theme Demo - Python Example
This file demonstrates how the theme looks with various Python constructs
"""

import asyncio
import json
import math
import random
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple, Union
from datetime import datetime, timedelta


class StarType(Enum):
    """Enumeration of different star types in the cosmic nebula"""
    RED_GIANT = "red_giant"
    WHITE_DWARF = "white_dwarf"
    NEUTRON_STAR = "neutron_star"
    PULSAR = "pulsar"
    BLACK_HOLE = "black_hole"


@dataclass
class Coordinates:
    """3D coordinates in space"""
    x: float
    y: float
    z: float
    
    def distance_to(self, other: 'Coordinates') -> float:
        """Calculate Euclidean distance to another point"""
        return math.sqrt(
            (self.x - other.x) ** 2 +
            (self.y - other.y) ** 2 +
            (self.z - other.z) ** 2
        )
    
    def __str__(self) -> str:
        return f"({self.x:.2f}, {self.y:.2f}, {self.z:.2f})"


@dataclass
class CelestialBody:
    """Represents a celestial body in the nebula"""
    name: str
    star_type: StarType
    coordinates: Coordinates
    mass: float  # in solar masses
    brightness: float = field(default_factory=lambda: random.random())
    discovered: datetime = field(default_factory=datetime.now)
    
    @property
    def age_in_days(self) -> int:
        """Calculate age since discovery in days"""
        return (datetime.now() - self.discovered).days
    
    def __post_init__(self):
        """Validate data after initialization"""
        if self.mass <= 0:
            raise ValueError("Mass must be positive")
        if not 0 <= self.brightness <= 1:
            raise ValueError("Brightness must be between 0 and 1")


class SpaceVehicle(ABC):
    """Abstract base class for space vehicles"""
    
    def __init__(self, name: str, fuel_capacity: float):
        self.name = name
        self.fuel_capacity = fuel_capacity
        self.current_fuel = fuel_capacity
        self.position = Coordinates(0.0, 0.0, 0.0)
        self.mission_log: List[str] = []
    
    @abstractmethod
    def max_speed(self) -> float:
        """Maximum speed of the vehicle"""
        pass
    
    @abstractmethod
    def fuel_consumption_rate(self) -> float:
        """Fuel consumption per unit distance"""
        pass
    
    def travel_to(self, destination: Coordinates) -> bool:
        """Travel to a destination if fuel allows"""
        distance = self.position.distance_to(destination)
        fuel_needed = distance * self.fuel_consumption_rate()
        
        if fuel_needed > self.current_fuel:
            self.log_mission(f"❌ Insufficient fuel for travel to {destination}")
            return False
        
        self.current_fuel -= fuel_needed
        self.position = destination
        self.log_mission(f"✅ Traveled to {destination}, fuel remaining: {self.current_fuel:.1f}")
        return True
    
    def log_mission(self, message: str) -> None:
        """Add entry to mission log"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.mission_log.append(f"[{timestamp}] {message}")
    
    def refuel(self, amount: float = None) -> None:
        """Refuel the vehicle"""
        if amount is None:
            amount = self.fuel_capacity - self.current_fuel
        
        self.current_fuel = min(self.fuel_capacity, self.current_fuel + amount)
        self.log_mission(f"⛽ Refueled: {amount:.1f} units, current fuel: {self.current_fuel:.1f}")


class ExplorationShip(SpaceVehicle):
    """Specialized ship for nebula exploration"""
    
    def __init__(self, name: str, crew_size: int = 5):
        super().__init__(name, fuel_capacity=1000.0)
        self.crew_size = crew_size
        self.discoveries: List[CelestialBody] = []
        self.scan_range = 50.0
    
    def max_speed(self) -> float:
        return 100.0  # units per time
    
    def fuel_consumption_rate(self) -> float:
        return 2.0  # fuel per distance unit
    
    async def scan_area(self, center: Coordinates, bodies: List[CelestialBody]) -> List[CelestialBody]:
        """Scan area for celestial bodies"""
        self.log_mission(f"🔍 Scanning area around {center}")
        
        # Simulate scanning time
        await asyncio.sleep(0.1)
        
        discovered = []
        for body in bodies:
            distance = center.distance_to(body.coordinates)
            if distance <= self.scan_range:
                discovered.append(body)
                if body not in self.discoveries:
                    self.discoveries.append(body)
                    self.log_mission(f"🌟 Discovered {body.name} ({body.star_type.value})")
        
        return discovered
    
    def analyze_discovery(self, body: CelestialBody) -> Dict[str, Union[str, float]]:
        """Analyze a discovered celestial body"""
        analysis = {
            "name": body.name,
            "type": body.star_type.value,
            "mass_category": self._categorize_mass(body.mass),
            "brightness_level": self._categorize_brightness(body.brightness),
            "distance_from_ship": self.position.distance_to(body.coordinates),
            "threat_level": self._assess_threat(body)
        }
        
        self.log_mission(f"📊 Analysis complete for {body.name}")
        return analysis
    
    def _categorize_mass(self, mass: float) -> str:
        """Categorize mass of celestial body"""
        if mass < 0.5:
            return "low_mass"
        elif mass < 2.0:
            return "medium_mass"
        elif mass < 10.0:
            return "high_mass"
        else:
            return "super_massive"
    
    def _categorize_brightness(self, brightness: float) -> str:
        """Categorize brightness level"""
        if brightness < 0.3:
            return "dim"
        elif brightness < 0.7:
            return "moderate"
        else:
            return "bright"
    
    def _assess_threat(self, body: CelestialBody) -> str:
        """Assess threat level of celestial body"""
        if body.star_type == StarType.BLACK_HOLE:
            return "extreme"
        elif body.star_type == StarType.NEUTRON_STAR and body.mass > 2.0:
            return "high"
        elif body.star_type == StarType.RED_GIANT and body.mass > 5.0:
            return "moderate"
        else:
            return "low"


class NebulaGenerator:
    """Generate random nebula with celestial bodies"""
    
    def __init__(self, seed: Optional[int] = None):
        if seed:
            random.seed(seed)
    
    @staticmethod
    def generate_celestial_bodies(count: int, region_size: float = 1000.0) -> List[CelestialBody]:
        """Generate random celestial bodies in a region"""
        bodies = []
        star_types = list(StarType)
        
        for i in range(count):
            # Generate random properties
            coordinates = Coordinates(
                x=random.uniform(-region_size/2, region_size/2),
                y=random.uniform(-region_size/2, region_size/2),
                z=random.uniform(-region_size/2, region_size/2)
            )
            
            star_type = random.choice(star_types)
            mass = NebulaGenerator._generate_mass_for_type(star_type)
            
            body = CelestialBody(
                name=f"{star_type.value.replace('_', ' ').title()} {i+1:03d}",
                star_type=star_type,
                coordinates=coordinates,
                mass=mass,
                discovered=datetime.now() - timedelta(days=random.randint(0, 365))
            )
            
            bodies.append(body)
        
        return bodies
    
    @staticmethod
    def _generate_mass_for_type(star_type: StarType) -> float:
        """Generate appropriate mass for star type"""
        mass_ranges = {
            StarType.WHITE_DWARF: (0.1, 1.4),
            StarType.RED_GIANT: (0.5, 8.0),
            StarType.NEUTRON_STAR: (1.4, 3.0),
            StarType.PULSAR: (1.4, 2.0),
            StarType.BLACK_HOLE: (3.0, 50.0)
        }
        
        min_mass, max_mass = mass_ranges[star_type]
        return random.uniform(min_mass, max_mass)


async def explore_cosmic_nebula():
    """Main exploration function"""
    print("🚀 Initializing Cosmic Nebula Exploration Mission")
    print("=" * 50)
    
    # Initialize exploration ship
    ship = ExplorationShip("USS Cosmic Explorer", crew_size=7)
    
    # Generate nebula
    generator = NebulaGenerator(seed=42)
    celestial_bodies = generator.generate_celestial_bodies(20, region_size=500.0)
    
    print(f"🌌 Generated nebula with {len(celestial_bodies)} celestial bodies")
    
    # Exploration waypoints
    waypoints = [
        Coordinates(100.0, 50.0, 25.0),
        Coordinates(-75.0, 150.0, -50.0),
        Coordinates(200.0, -100.0, 75.0),
        Coordinates(-150.0, -200.0, 100.0)
    ]
    
    discoveries_summary = []
    
    # Explore each waypoint
    for i, waypoint in enumerate(waypoints, 1):
        print(f"\n📍 Waypoint {i}: {waypoint}")
        
        # Travel to waypoint
        if not ship.travel_to(waypoint):
            print("⛽ Refueling required...")
            ship.refuel()
            ship.travel_to(waypoint)
        
        # Scan area
        discovered = await ship.scan_area(waypoint, celestial_bodies)
        
        # Analyze discoveries
        for body in discovered:
            analysis = ship.analyze_discovery(body)
            discoveries_summary.append(analysis)
            
            # Print interesting discoveries
            if analysis["threat_level"] in ["high", "extreme"]:
                print(f"⚠️  High threat detected: {body.name} ({analysis['threat_level']} threat)")
            elif analysis["brightness_level"] == "bright":
                print(f"✨ Bright object found: {body.name}")
    
    # Mission summary
    print("\n" + "=" * 50)
    print("📋 MISSION SUMMARY")
    print("=" * 50)
    print(f"Total discoveries: {len(ship.discoveries)}")
    print(f"Fuel remaining: {ship.current_fuel:.1f}/{ship.fuel_capacity}")
    print(f"Distance traveled: {sum(ship.position.distance_to(wp) for wp in waypoints):.1f} units")
    
    # Threat analysis
    threat_counts = {}
    for discovery in discoveries_summary:
        threat = discovery["threat_level"]
        threat_counts[threat] = threat_counts.get(threat, 0) + 1
    
    print("\n🛡️ Threat Analysis:")
    for threat_level, count in sorted(threat_counts.items()):
        print(f"  {threat_level.capitalize()}: {count}")
    
    # Save mission data
    mission_data = {
        "ship_name": ship.name,
        "crew_size": ship.crew_size,
        "discoveries": [
            {
                "name": body.name,
                "type": body.star_type.value,
                "coordinates": [body.coordinates.x, body.coordinates.y, body.coordinates.z],
                "mass": body.mass,
                "brightness": body.brightness
            }
            for body in ship.discoveries
        ],
        "mission_log": ship.mission_log,
        "final_position": [ship.position.x, ship.position.y, ship.position.z],
        "fuel_remaining": ship.current_fuel
    }
    
    with open("cosmic_mission_report.json", "w") as f:
        json.dump(mission_data, f, indent=2, default=str)
    
    print("\n💾 Mission report saved to cosmic_mission_report.json")
    print("🎉 Cosmic Nebula exploration complete!")


if __name__ == "__main__":
    # Run the exploration mission
    try:
        asyncio.run(explore_cosmic_nebula())
    except KeyboardInterrupt:
        print("\n🛑 Mission aborted by user")
    except Exception as e:
        print(f"\n💥 Mission failed: {e}")
        raise
