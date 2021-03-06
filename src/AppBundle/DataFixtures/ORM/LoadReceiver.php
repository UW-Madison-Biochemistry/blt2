<?php


namespace AppBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Entity\Receiver;

class LoadReceiver extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null) {
        $this->container = $container;
    }
    
    public function load(ObjectManager $manager) {
        $fixtureReceiver = new Receiver("fixtureReceiver", 111, "anon.");
        $fixtureReceiver2 = new Receiver("fixtureReceiver2", 111, "anon.");
        $fixtureReceiver3 = new Receiver("fixtureReceiver3", 111, "anon.");

        $fixtureReceiver2->setEnabled(false, "anon.");

        $this->addReference("fixtureReceiver", $fixtureReceiver);
        $this->addReference("fixtureReceiver2", $fixtureReceiver2);

        $manager->persist($fixtureReceiver);
        $manager->persist($fixtureReceiver2);
        $manager->persist($fixtureReceiver3);

        $manager->flush();
    }

    public function getOrder() {
        return 3;
    }
}