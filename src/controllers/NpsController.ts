import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";

import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUSers =  await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveyUSers.filter(
      (survey) => survey.value >= 0 && survey.value <=6
      ).length;

      const promoters = surveyUSers.filter(
        (survey) => survey.value >= 9 && survey.value <=10
        ).length;

        const passive = surveyUSers.filter(
          (survey) => survey.value >= 7 && survey.value <=8
          ).length;

          const totalAnswers = surveyUSers.length;

          const calculate = Number(
            (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
          );
          return response.json({
            detractor,
             promoters,
             passive,
             totalAnswers,
             nps:calculate,
          });
  }

}

export { NpsController };