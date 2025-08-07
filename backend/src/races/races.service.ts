import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Race } from './schemas/race.schema';
import { Model, Types } from 'mongoose';

export class RaceAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super(`Race with name ${name} already exists`);
  }
}

export class RaceNotFoundException extends Error {
  constructor(id: string) {
    super(`Race with id ${id} not found`);
  }
}

@Injectable()
export class RacesService {
  constructor(@InjectModel(Race.name) private readonly raceModel:Model<Race>) {}

  async create(createRaceDto: CreateRaceDto) {
    //
    const existingRace = await this.raceModel
      .findOne({
        $or: [{ nom: createRaceDto.nom }, { nom_ar: createRaceDto.nom_ar }],
      })
      .exec();
    if (existingRace) throw new RaceAlreadyExistsException(`Race with name ${createRaceDto.nom} already exists`);
    return await this.raceModel.create(createRaceDto);
  }

  async findAll() {
    return await this.raceModel.find().exec();
  }

  async findOne(id: string) {
    if(!Types.ObjectId.isValid(id))
      throw new RaceNotFoundException(`Invalid id format: ${id}`);
    const race = await this.raceModel.findById(id).exec();
    if(!race) 
      throw new RaceNotFoundException(`Race with id ${id} not found`);
    return race
  }

  async update(id: string, updateRaceDto: UpdateRaceDto) {
    if (!Types.ObjectId.isValid(id))
      throw new RaceNotFoundException(`Invalid id format: ${id}`);
    const existingRace = await this.raceModel
      .findOne({
        $or: [{ nom: updateRaceDto.nom }, { nom_ar: updateRaceDto.nom_ar }],
      })
      .exec();
    if(existingRace) throw new RaceAlreadyExistsException(`Race with name ${updateRaceDto.nom} already exists`);
    const race = await this.raceModel
      .findByIdAndUpdate(id, updateRaceDto, { new: true })
      .exec();
    if (!race) 
      throw new RaceNotFoundException(`Race with id ${id} not found`);
    return race
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new RaceNotFoundException(`Invalid id format: ${id}`);
    const race = await this.raceModel
      .findByIdAndDelete(id)
      .exec();
    if (!race)
      throw new RaceNotFoundException(`Race with id ${id} not found`);
    return race;
  }
}
